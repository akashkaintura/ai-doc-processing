/// <reference lib="webworker" />

interface WorkerGlobalScope {
    OCR: {
        processImage: (buffer: ArrayBuffer) => Promise<string>;
    };
}

// Import WASM initialization script
importScripts('/wasm/ocr-engine.js');

let isOCRLoaded = false;

// Initialize WASM module
self.onmessage = async (e) => {
    if (e.data.type === 'INIT') {
        try {
            const wasmModule = await WebAssembly.instantiateStreaming(
                fetch('/wasm/ocr-engine.wasm'),
                {
                    env: {
                        memory: new WebAssembly.Memory({ initial: 256 }),
                        abort: (msg: string) => console.error(`WASM Aborted: ${msg}`)
                    }
                }
            );

            self.OCR = {
                processImage: (buffer: ArrayBuffer) => {
                    const result = (wasmModule.instance.exports.process_image as CallableFunction)(
                        new Uint8Array(buffer),
                        buffer.byteLength
                    );
                    return Promise.resolve(result.toString());
                }
            };

            isOCRLoaded = true;
            self.postMessage({ type: 'INIT_SUCCESS' });
        } catch (error) {
            self.postMessage({
                type: 'INIT_ERROR',
                error: error instanceof Error ? error.message : 'Failed to load OCR'
            });
        }
        return;
    }

    if (!isOCRLoaded) {
        self.postMessage({
            error: 'OCR engine not initialized. Send INIT message first.'
        });
        return;
    }

    const { imageBuffer } = e.data;
    try {
        const text = await self.OCR.processImage(imageBuffer);
        self.postMessage({ text });
    } catch (error) {
        self.postMessage({
            error: error instanceof Error ? error.message : 'OCR processing failed'
        });
    }
};
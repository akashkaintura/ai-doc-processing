/// <reference lib="webworker" />

// Import WASM initialization glue code
importScripts('/wasm/ocr-engine.js');

// Type declarations for WASM exports
interface OCRExports {
    process_image: (ptr: number, len: number) => string;
    memory: WebAssembly.Memory;
    malloc: (size: number) => number;
    free: (ptr: number) => void;
}

class OCRProcessor {
    private instance!: WebAssembly.Instance;
    private exports!: OCRExports;
    private memoryBuffer!: Uint8Array;

    async initialize() {
        try {
    const result = await WebAssembly.instantiateStreaming(
        fetch('/wasm/ocr-engine.wasm'),
        { env: { memory: new WebAssembly.Memory({ initial: 256 }) } }
    );

            this.instance = result.instance;
            this.exports = this.instance.exports as unknown as OCRExports;
            this.memoryBuffer = new Uint8Array(this.exports.memory.buffer);

            self.postMessage({ type: 'READY' });
        } catch (error) {
            self.postMessage({
                type: 'ERROR',
                error: error instanceof Error ? error.message : 'WASM initialization failed'
            });
        }
    }

    processImage(buffer: ArrayBuffer): string {
        const inputBytes = new Uint8Array(buffer);

        // Allocate memory in WASM space
        const ptr = this.exports.malloc(inputBytes.length);
        if (!ptr) throw new Error('Memory allocation failed');

        // Copy image data to WASM memory
        this.memoryBuffer.set(inputBytes, ptr);

        // Process and clean up
        const result = this.exports.process_image(ptr, inputBytes.length);
        this.exports.free(ptr);

        return result;
    }
}

const processor = new OCRProcessor();

self.onmessage = async (e) => {
    if (e.data.type === 'INIT') {
        await processor.initialize();
        return;
    }

    if (e.data.type === 'PROCESS') {
        try {
            const result = processor.processImage(e.data.imageBuffer);
            self.postMessage({
                type: 'RESULT',
                text: result
            });
        } catch (error) {
            self.postMessage({
                type: 'ERROR',
                error: error instanceof Error ? error.message : 'Processing failed'
            });
        }
    }
};
importScripts('../../public/wasm/ocr-engine.wasm');
import { useEffect } from 'react';

self.onmessage = async (e) => {
    const { imageBuffer } = e.data;
    // WASM OCR processing
    const text = await OCR.processImage(imageBuffer);
    postMessage(text);
};



// src/hooks/useWasm.ts
export const useWasm = (wasmPath: string) => {
    useEffect(() => {
        const loadWasm = async () => {
            const imports = {
                env: {
                    memory: new WebAssembly.Memory({ initial: 256 }),
                    abort: () => console.error('WASM Aborted')
                }
            };

            const { instance } = await WebAssembly.instantiateStreaming(
                fetch(wasmPath),
                imports
            );

            return instance.exports;
        };

        loadWasm();
    }, [wasmPath]);
};
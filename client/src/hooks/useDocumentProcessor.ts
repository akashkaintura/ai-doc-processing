import { useCallback } from 'react';
import { useWasm } from './useWasm';

export const useDocumentProcessor = () => {
    const { wasmModule } = useWasm('/wasm/ocr-engine.wasm');

    const processDocument = useCallback(async (file: File) => {
        if (!wasmModule) throw new Error('WASM not loaded');

        const buffer = await file.arrayBuffer();
        const text = await wasmModule.processImage(buffer);

        return {
            content: text,
            entities: [],
            summary: ''
        };
    }, [wasmModule]);

    return { processDocument };
};
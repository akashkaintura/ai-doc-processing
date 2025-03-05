import { useEffect, useState } from 'react';

declare global {
    interface Window {
        OCR: {
            processImage: (buffer: ArrayBuffer) => Promise<string>;
        };
    }
}

export const useWasm = (wasmPath: string) => {
    const [wasmModule, setWasmModule] = useState<typeof window.OCR | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWasm = async () => {
            try {
                const imports = {
                    env: {
                        memory: new WebAssembly.Memory({ initial: 256 }),
                        abort: (msg: string) => console.error(`WASM Aborted: ${msg}`)
                    }
                };

                const { instance } = await WebAssembly.instantiateStreaming(
                    fetch(wasmPath),
                    imports
                );

                // Initialize OCR with proper typing
                window.OCR = {
                    processImage: async (buffer: ArrayBuffer) => {
                        const result = (instance.exports.process_image as CallableFunction)(
                            new Uint8Array(buffer),
                            buffer.byteLength
                        );
                        return result as string;
                    }
                };

                setWasmModule(window.OCR);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('WASM load failed'));
            } finally {
                setLoading(false);
            }
        };

        loadWasm();
    }, [wasmPath]);

    return { wasmModule, loading, error };
};
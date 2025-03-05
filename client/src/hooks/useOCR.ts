import { useEffect, useRef, useState } from 'react';

export const useOCR = () => {
    const workerRef = useRef<Worker | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../lib/workers/ocr.worker.ts', import.meta.url));

        const worker = workerRef.current;
        worker.postMessage({ type: 'INIT' });

        worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
            switch (e.data.type) {
                case 'READY':
                    setReady(true);
                    break;
                case 'ERROR':
                    setError(e.data.error || 'Unknown error');
                    break;
            }
        };

        return () => worker.terminate();
    }, []);

    const processImage = async (file: File): Promise<string> => {
        if (!workerRef.current || !ready) {
            throw new Error('OCR worker not ready');
        }

        return new Promise(async (resolve, reject) => {
            const worker = workerRef.current!;
            const buffer = await file.arrayBuffer();

            const handler = (e: MessageEvent<WorkerMessage>) => {
                if (e.data.type === 'RESULT') {
                    worker.removeEventListener('message', handler);
                    resolve(e.data.text!);
                } else if (e.data.type === 'ERROR') {
                    worker.removeEventListener('message', handler);
                    reject(e.data.error || 'Processing failed');
                }
            };

            worker.addEventListener('message', handler);
            worker.postMessage({
                type: 'PROCESS',
                imageBuffer: buffer
            }, [buffer]);
        });
    };

    return { processImage, ready, error };
};
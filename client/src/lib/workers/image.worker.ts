/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e) => {
    const { imageData, options } = e.data;

    try {
        const processed = await processImage(imageData, options);
        self.postMessage({ imageData: processed });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};

async function processImage(data: ImageData, options: {
    targetWidth: number;
    targetHeight: number;
    quality?: number;
}): Promise<ImageData> {
    const canvas = new OffscreenCanvas(options.targetWidth, options.targetHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas context not available');

    // Perform image scaling and preprocessing
    ctx.drawImage(
        await createImageBitmap(data),
        0, 0, data.width, data.height,
        0, 0, options.targetWidth, options.targetHeight
    );

    return ctx.getImageData(0, 0, options.targetWidth, options.targetHeight);
}
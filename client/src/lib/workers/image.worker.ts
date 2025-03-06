/// <reference lib="webworker" />

interface ProcessImageOptions {
  targetWidth: number;
  targetHeight: number;
  quality?: number;
}

self.onmessage = async (e) => {
    const { imageData, options } = e.data as {
        imageData: ImageData;
        options: ProcessImageOptions;
    };

    try {
        const processed = await processImage(imageData, options);
        self.postMessage({ imageData: processed });
    } catch (error) {
        self.postMessage({ 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

async function processImage(
    data: ImageData,
    options: ProcessImageOptions
): Promise<ImageData> {
    const canvas = new OffscreenCanvas(options.targetWidth, options.targetHeight);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) throw new Error('Canvas context not available');

    // Perform image scaling and preprocessing
    ctx.drawImage(
        await createImageBitmap(data),
        0, 0, data.width, data.height,
        0, 0, options.targetWidth, options.targetHeight
    );

    return ctx.getImageData(0, 0, options.targetWidth, options.targetHeight);
}
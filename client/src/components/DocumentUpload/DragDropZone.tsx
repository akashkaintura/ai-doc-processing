import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOCR } from '../../hooks/useOCR';

export const DragDropZone = () => {
    const { processImage, ready } = useOCR();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            const text = await processImage(file);
            // Store results in state management
        } catch (error) {
            console.error('OCR Processing Error:', error);
        }
    }, [processImage]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        },
        maxSize: 50 * 1024 * 1024 // 50MB
        ,
        multiple: undefined,
        onDragEnter: undefined,
        onDragOver: undefined,
        onDragLeave: undefined
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {ready ? 'Drop files here' : 'Initializing OCR...'}
        </div>
    );
};
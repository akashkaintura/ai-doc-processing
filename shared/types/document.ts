export interface DocumentAnalysis {
    id: string;
    content: string;
    summary: string;
    entities: DocumentEntity[];
    vector: number[];
    metadata: {
        language: string;
        pageCount: number;
        fileSize: number;
        processedAt: Date;
    };
}

export type EntityType = 'PERSON' | 'ORG' | 'DATE' | 'LOCATION' | 'CONTRACT_TERM';
export interface DocumentEntity {
    text: string;
    type: EntityType;
    confidence: number;
    context?: string;
}

export interface OCRResult {
    text: string;
    confidence: number;
    blocks: TextBlock[];
}

interface TextBlock {
    text: string;
    boundingBox: number[];
    pageNumber: number;
}

// wasm/memory.ts
export const initWasmMemory = (initial = 256) => {
    return new WebAssembly.Memory({
        initial,
        maximum: 2048,
        shared: true
    });
};
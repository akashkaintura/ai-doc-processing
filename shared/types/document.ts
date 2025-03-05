export interface DocumentAnalysis {
    id: string;
    content: string;
    entities: Entity[];
    summary: string;
    vector: number[];
}

export interface Entity {
    text: string;
    type: 'DATE' | 'PERSON' | 'ORG';
    confidence: number;
}

// wasm/memory.ts
export const initWasmMemory = (initial = 256) => {
    return new WebAssembly.Memory({
        initial,
        maximum: 2048,
        shared: true
    });
};
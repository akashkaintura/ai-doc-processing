import * as onnx from 'onnxruntime-node';
import { Tensor } from 'onnxruntime-node';
import { tokenize } from '../nlp-models/tokenizer';

export class EmbeddingGenerator {
    private session: onnx.InferenceSession;

    async initialize(modelPath: string) {
        this.session = await onnx.InferenceSession.create(modelPath);
    }

    async generate(text: string): Promise<number[]> {
        const inputs = this.preprocess(text);
        const results = await this.session.run(inputs);
        return this.postprocess(results);
    }

    private preprocess(text: string) {
        // Tokenization and tensor conversion
        const tokens = tokenize(text);
        return {
            input_ids: new Tensor('int64', tokens, [1, tokens.length])
        };
    }

    private postprocess(outputs: onnx.InferenceSession.OnnxValueMapType) {
        const embeddings = outputs.embeddings.data as Float32Array;
        return Array.from(embeddings);
    }
}
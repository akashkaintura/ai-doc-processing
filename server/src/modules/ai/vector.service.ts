import { Injectable } from '@nestjs/common';
import { EmbeddingGenerator } from '../../../../ai-core/embeddings/generate';
import { DocumentEntity, EntityType } from '../../../../shared/types/document';
import { NERModel } from '../../../../ai-core/nlp-models/ner';

@Injectable()
export class VectorService {
  private embeddingModel: EmbeddingGenerator;
  private nerModel: NERModel;

  constructor() {
    this.embeddingModel = new EmbeddingGenerator();
    this.nerModel = new NERModel();
    this.initialize();
  }

  async initialize() {
    await Promise.all([
      this.embeddingModel.initialize('models/embeddings.onnx'),
      this.nerModel.initialize('models/ner.onnx'),
    ]);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.embeddingModel.generate(text);
  }

  async extractEntities(text: string): Promise<DocumentEntity[]> {
    // Implementation using NER model
    const entities = await this.nerModel.predict(text);
    return entities.map((entity) => ({
      text: entity.word,
      type: entity.label as EntityType,
      confidence: entity.score,
    }));
  }
}

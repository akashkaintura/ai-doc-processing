import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { VectorService } from './vector.service';

@Injectable()
export class AIService {
  constructor(
    private readonly openai: OpenAI,
    private readonly vectorService: VectorService,
  ) {}

  async processDocument(text: string) {
    const [summary, entities] = await Promise.all([
      this.generateSummary(text),
      this.extractEntities(text),
    ]);

    const embedding = await this.vectorService.generateEmbedding(text);

    return { summary, entities, embedding };
  }

  private async generateSummary(text: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'user',
          content: `Summarize this document in 3 paragraphs: ${text.slice(0, 10000)}`,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  private async extractEntities(text: string) {
    // Custom entity extraction logic
    return this.vectorService.extractEntities(text);
  }
}

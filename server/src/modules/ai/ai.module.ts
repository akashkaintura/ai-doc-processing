import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { VectorService } from './vector.service';

@Module({
  providers: [AIService, VectorService],
  exports: [AIService],
})
export class AIModule {}

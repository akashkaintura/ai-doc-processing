import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIModule } from './modules/ai/ai.module';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Module({
  imports: [AIModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: OpenAI,
      useFactory: (config: ConfigService) =>
        new OpenAI({
          apiKey: config.get('OPENAI_API_KEY'),
        }),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}

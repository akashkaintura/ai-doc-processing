import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export class DocumentProcessingRequest {
  content: string;
  mimeType: string;
}

@Injectable()
export class DocumentValidationPipe implements PipeTransform {
  async transform(value: any) {
    const doc = new DocumentProcessingRequest();
    doc.content = value.content;
    doc.mimeType = value.mimeType;

    const errors = await validate(doc);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid document input');
    }

    if (!['text/plain', 'application/pdf'].includes(doc.mimeType)) {
      throw new BadRequestException('Unsupported file type');
    }

    if (doc.content.length > 10_000_000) {
      throw new BadRequestException('Document too large');
    }

    return value;
  }
}

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { DocumentProcessingDto } from '../../dto/document-processing.dto';

@Injectable()
export class DocumentValidationPipe implements PipeTransform {
  async transform(value: any): Promise<DocumentProcessingDto> {
    const doc = new DocumentProcessingDto();
    doc.content = value.content;
    doc.mimeType = value.mimeType;
    doc.originalName = value.originalName;

    const errors = await validate(doc);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    this.validateMimeType(doc.mimeType);
    this.validateContentSize(doc.content);

    return value;
  }

  private validateMimeType(mimeType: string) {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'text/plain',
    ];

    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${mimeType}`);
    }
  }

  private validateContentSize(content: string) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const contentSize = Buffer.from(content).length;

    if (contentSize > maxSize) {
      throw new BadRequestException(
        `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      );
    }
  }

  private formatErrors(errors: any[]) {
    return errors.map((err) => ({
      property: err.property,
      constraints: err.constraints,
    }));
  }
}

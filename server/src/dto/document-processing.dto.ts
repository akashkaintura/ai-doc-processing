import { IsString, IsNotEmpty, IsIn, MaxLength } from 'class-validator';

export class DocumentProcessingDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10 * 1024 * 1024) // 10MB
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['image/png', 'image/jpeg', 'application/pdf', 'text/plain'])
  mimeType: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  originalName: string;
}

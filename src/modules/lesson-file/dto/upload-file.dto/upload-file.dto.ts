import { IsString, IsNumber } from 'class-validator';

export class UploadFileDto {
  @IsString()
  fileUrl: string;

  @IsNumber()
  size: number;

  @IsString()
  lessonId: string;
}

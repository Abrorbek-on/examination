import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLessonFileDto {
  @IsString()
  file: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsInt()
  lessonId: number;
}

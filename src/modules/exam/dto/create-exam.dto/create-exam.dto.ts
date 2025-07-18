import { IsEnum, IsInt, IsString } from 'class-validator';
import { ExamAnswer } from '@prisma/client';

export class CreateExamDto {
  @IsString()
  question: string;

  @IsString()
  variantA: string;

  @IsString()
  variantB: string;

  @IsString()
  variantC: string;

  @IsString()
  variantD: string;

  @IsEnum(ExamAnswer)
  answer: ExamAnswer;

  @IsInt()
  lessonGroupId: number;
}

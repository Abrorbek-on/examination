import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionAnswerDto {
  @IsInt()
  questionId: number;

  @IsInt()
  userId: number;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  file?: string;
}

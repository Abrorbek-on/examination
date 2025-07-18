import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  file?: string;
}

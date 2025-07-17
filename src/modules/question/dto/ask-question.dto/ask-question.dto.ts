import { IsString } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  lessonId: string;

  @IsString()
  text: string;
}

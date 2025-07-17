import { IsString } from 'class-validator';

export class CreateHomeworkDto {
  @IsString()
  title: string;

  @IsString()
  lessonId: string;
}

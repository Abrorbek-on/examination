import { IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  videoUrl: string;

  @IsString()
  groupId: string;
}

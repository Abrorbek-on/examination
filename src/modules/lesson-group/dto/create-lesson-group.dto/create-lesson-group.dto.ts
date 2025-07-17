import { IsString } from 'class-validator';

export class CreateLessonGroupDto {
  @IsString()
  title: string;

  @IsString()
  courseId: string;
}

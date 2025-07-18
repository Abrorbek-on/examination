import { IsBoolean, IsInt } from 'class-validator';

export class CreateLessonViewDto {
  @IsInt()
  lessonId: number;

  @IsInt()
  userId: number;

  @IsBoolean()
  view: boolean;
}

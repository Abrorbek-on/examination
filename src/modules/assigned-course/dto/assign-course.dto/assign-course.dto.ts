import { IsString } from 'class-validator';

export class AssignCourseDto {
  @IsString()
  courseId: string;

  @IsString()
  userId: string;
}

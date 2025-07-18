import { IsInt } from 'class-validator';

export class CreateAssignedCourseDto {
  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;
}

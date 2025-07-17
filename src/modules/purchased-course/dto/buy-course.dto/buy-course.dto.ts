import { IsString } from 'class-validator';

export class BuyCourseDto {
  @IsString()
  courseId: string;

  @IsString()
  userId: string;
}

import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  PRE_INTERMEDIATE = 'PRE_INTERMEDIATE',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  categoryId: string;
}

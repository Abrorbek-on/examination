import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateCourseDto } from '../create-course.dto/create-course.dto';
import { CourseLevel } from '@prisma/client';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsEnum(CourseLevel, {
    message: 'level faqat BEGINNER, INTERMEDIATE yoki ADVANCED bo\'lishi mumkin',
  })
  level?: CourseLevel;
}

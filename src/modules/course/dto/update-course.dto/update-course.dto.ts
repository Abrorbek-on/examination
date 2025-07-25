import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { CreateCourseDto } from '../create-course.dto/create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsEnum(CourseLevel, {
    message: 'level faqat BEGINNER, INTERMEDIATE yoki ADVANCED bo\'lishi mumkin',
  })
  level?: CourseLevel;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Bootcamp' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bu kurs NestJS framework haqida' })
  @IsString()
  about: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://cdn.example.com/nestjs.jpg' })
  @IsString()
  banner: string;

  @ApiProperty({ example: 'https://cdn.example.com/intro.mp4' })
  @IsString()
  introVideo: string;

  @ApiProperty({ example: 'BEGINNER', enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 2 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  mentorId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  published: boolean;
}

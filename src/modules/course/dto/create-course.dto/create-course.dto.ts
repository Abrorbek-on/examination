import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Bootcamp', description: 'Kurs nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bu kurs NestJS framework haqida', description: 'Kurs haqida qisqacha maʼlumot' })
  @IsString()
  about: string;

  @ApiProperty({ example: 120000, description: 'Kurs narxi' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://cdn.example.com/nestjs.jpg', description: 'Banner rasmi URL' })
  @IsString()
  banner: string;

  @ApiProperty({ example: 'https://cdn.example.com/intro.mp4', description: 'Kirish videosi URL' })
  @IsString()
  introVideo: string;

  @ApiProperty({ example: 'BEGINNER', enum: CourseLevel, description: 'Kurs darajasi' })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 2, description: 'Category ID (foreign key)' })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 5, description: 'Mentor ID (foreign key)' })
  @IsInt()
  mentorId: number;

  @ApiProperty({ example: true, description: 'Kurs eʼlon qilinganmi yo‘qmi' })
  @IsBoolean()
  published: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Asoslari', description: 'Kurs nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'NestJS framework haqida toliq kurs', description: 'Kurs haqida malumot' })
  @IsString()
  about: string;

  @ApiProperty({ example: 99000, description: 'Kurs narxi somlarda' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/banner.jpg', description: 'Banner rasmi URL' })
  @IsString()
  banner: string;

  @ApiProperty({ example: 'https://example.com/intro.mp4', description: 'Kirish videosi URL' })
  @IsString()
  introVideo: string;

  @ApiProperty({ enum: CourseLevel, description: 'Kurs darajasi' })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 1, description: 'Kategoriya ID' })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 5, description: 'Mentor ID (foydalanuvchi)' })
  @IsInt()
  mentorId: number;

  @ApiProperty({ example: true, description: 'Nashr qilinganmi' })
  @IsBoolean()
  published: boolean;
}

import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiConsumes } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @ApiProperty({ example: 'JavaScript Asoslari' })
  @IsString()
  name: string;

  @ApiProperty({ example: "Kurs haqida ma'lumot" })
  @IsString()
  about: string;

  @ApiProperty({ example: 299000 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Kurs banner rasmi',
  })
  @IsOptional()
  banner: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Kirish video',
  })
  @IsOptional()
  introVideo: any;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 5, description: 'Mentor ID' })
  @IsNumber()
  @Type(() => Number)
  mentorId: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

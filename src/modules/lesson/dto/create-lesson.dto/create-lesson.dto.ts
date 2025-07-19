import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({
    example: 'JavaScript o\'zgaruvchilar',
    description: 'Dars nomi',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'JavaScript da o\'zgaruvchilar bilan ishlash',
    description: 'Dars haqida ma\'lumot',
  })
  @IsString()
  about: string;

  @ApiProperty({
    example: 'https://example.com/lesson-video.mp4',
    description: 'Dars video URL',
  })
  @IsString()
  video: string;

  @ApiProperty({
    example: 1,
    description: 'Dars guruhi ID',
  })
  @IsNumber()
  @Type(() => Number)
  groupId: number;
}

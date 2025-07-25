import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'JS Kirish', description: 'Dars nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Dars haqida', description: 'Tavsif' })
  @IsString()
  about: string;

  @ApiProperty({ example: 1, description: 'Guruh ID' })
  @IsNumber()
  @Type(() => Number)
  groupId: number;
}

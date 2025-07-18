import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHomeworkDto {
  @ApiPropertyOptional({ example: 'Tahrirlangan topshiriq' })
  @IsOptional()
  @IsString()
  task?: string;

  @ApiPropertyOptional({ example: 'updated-file.pdf' })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsInt()
  lessonId?: number;
}

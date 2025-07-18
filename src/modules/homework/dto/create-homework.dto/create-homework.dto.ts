import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Dars uchun topshiriq' })
  @IsString()
  task: string;

  @ApiPropertyOptional({ example: 'file.pdf' })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  lessonId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Type(() => Number)
  courseId: number;

  @ApiProperty({ example: 'NestJS haqida savol' })
  @IsString()
  text: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: string;
}

import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  groupId?: number;
}

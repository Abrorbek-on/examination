import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({ example: 'Programming' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

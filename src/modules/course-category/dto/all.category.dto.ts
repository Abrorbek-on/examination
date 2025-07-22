import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllCourseCategoriesDto {
  @ApiPropertyOptional({ example: 0, description: 'Qaysi elementdan boshlab olish (offset)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ example: 10, description: 'Nechta element olish (limit)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}

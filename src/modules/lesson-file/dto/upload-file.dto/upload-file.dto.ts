import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateLessonFileDto {
  @ApiProperty({ example: "lesson-123456789.mp4", description: "Yuklangan fayl nomi" })
  @IsString()
  file: string;

  @ApiPropertyOptional({ example: "Qo'shimcha materiallar" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  lessonId: number;
}

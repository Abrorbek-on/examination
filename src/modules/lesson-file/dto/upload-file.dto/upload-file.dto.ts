import { IsString, IsNumber, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class CreateLessonFileDto {
  @ApiProperty({
    example: "https://example.com/lesson-material.pdf",
    description: "Fayl URL manzili",
  })
  @IsString()
  file: string

  @ApiPropertyOptional({
    example: "Qo'shimcha materiallar",
    description: "Fayl haqida izoh",
  })
  @IsOptional()
  @IsString()
  note?: string

  @ApiProperty({
    example: 1,
    description: "Dars ID",
  })
  @IsNumber()
  @Type(() => Number)
  lessonId: number
}

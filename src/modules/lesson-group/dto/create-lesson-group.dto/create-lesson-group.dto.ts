import { IsString, IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class CreateLessonGroupDto {
  @ApiProperty({
    example: "JavaScript Asoslari - 1-bo'lim",
    description: "Dars guruhi nomi",
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 1,
    description: "Kurs ID",
  })
  @IsNumber()
  @Type(() => Number)
  courseId: number
}
import { IsEnum, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';

export class CreateExamDto {
  @ApiProperty({ example: '2 + 2 = ?', description: 'Test savoli' })
  @IsString()
  question: string;

  @ApiProperty({ example: '2', description: 'A javobi' })
  @IsString()
  variantA: string;

  @ApiProperty({ example: '3', description: 'B javobi' })
  @IsString()
  variantB: string;

  @ApiProperty({ example: '4', description: 'C javobi' })
  @IsString()
  variantC: string;

  @ApiProperty({ example: '5', description: 'D javobi' })
  @IsString()
  variantD: string;

  @ApiProperty({ example: 'variantC', enum: ExamAnswer, description: 'Togri javob' })
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;

  @ApiProperty({ example: 1, description: 'LessonGroup ID' })
  @IsInt()
  lessonGroupId: number;
}

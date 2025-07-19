import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateAssignedCourseDto {
  @ApiProperty({ example: 7, description: 'Foydalanuvchi IDsi' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1, description: 'Kurs IDsi' })
  @IsInt()
  courseId: number;
}

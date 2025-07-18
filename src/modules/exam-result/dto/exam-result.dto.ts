import { IsBoolean, IsInt } from 'class-validator';

export class CreateExamResultDto {
  @IsInt()
  lessonGroupId: number;

  @IsInt()
  userId: number;

  @IsBoolean()
  passed: boolean;

  @IsInt()
  corrects: number;

  @IsInt()
  wrongs: number;
}

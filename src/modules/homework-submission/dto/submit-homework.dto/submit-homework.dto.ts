import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';

export class CreateHomeworkSubmissionDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(HomeworkSubStatus)
  status?: HomeworkSubStatus;

  @IsInt()
  homeworkId: number;

  @IsInt()
  userId: number;
}

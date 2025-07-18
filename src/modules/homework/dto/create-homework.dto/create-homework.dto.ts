import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkDto {
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  file?: string;

  @IsInt()
  lessonId: number;
}

import { IsString } from 'class-validator';

export class SubmitHomeworkDto {
  @IsString()
  homeworkId: string;

  @IsString()
  fileUrl: string;
}

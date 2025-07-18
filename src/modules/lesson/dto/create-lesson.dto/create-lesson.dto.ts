import { IsInt, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsString()
  about: string;

  @IsString()
  video: string;

  @IsInt()
  groupId: number;
}

import { IsInt, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  rate: number;

  @IsString()
  comment: string;

  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;
}

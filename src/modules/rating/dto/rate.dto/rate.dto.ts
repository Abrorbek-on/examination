import { IsNumber, IsString, Min, Max } from 'class-validator';

export class RateDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  courseId: string;

  @IsString()
  userId: string;
}

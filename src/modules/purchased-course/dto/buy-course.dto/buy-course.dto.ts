import { IsEnum, IsInt, IsNumber } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class CreatePurchasedCourseDto {
  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;

  @IsNumber()
  amount: number;

  @IsEnum(PaidVia)
  paidVia: PaidVia;
}

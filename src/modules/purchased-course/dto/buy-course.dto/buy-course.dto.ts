import { PaidVia } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class PurchaseCourseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ enum: PaidVia })
  @IsEnum(PaidVia)
  @IsNotEmpty()
  paidVia: PaidVia;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreatePurchasedCourseDto extends PurchaseCourseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

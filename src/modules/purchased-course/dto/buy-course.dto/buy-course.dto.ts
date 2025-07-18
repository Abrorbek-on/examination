import { PaidVia } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseCourseDto {
  @ApiProperty()
  courseId: number;

  @ApiProperty({ enum: PaidVia })
  paidVia: PaidVia;

  @ApiProperty()
  amount: number;
}
export class CreatePurchasedCourseDto extends PurchaseCourseDto {
  @ApiProperty()
  userId: number;
}
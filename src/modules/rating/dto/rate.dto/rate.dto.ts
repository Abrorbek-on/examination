import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  courseId: number;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  comment: string;
}

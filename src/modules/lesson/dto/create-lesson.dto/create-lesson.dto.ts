import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  about: string;

  @ApiProperty()
  @IsString()
  video: string;

  @ApiProperty()
  @IsInt()
  groupId: number;
}

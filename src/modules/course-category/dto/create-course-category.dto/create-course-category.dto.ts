import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

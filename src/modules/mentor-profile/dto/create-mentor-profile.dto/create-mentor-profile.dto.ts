import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMentorProfileDto {
  @IsString()
  about: string;

  @IsString()
  job: string;

  @IsString()
  experience: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsInt()
  userId: number;
}

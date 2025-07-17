import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

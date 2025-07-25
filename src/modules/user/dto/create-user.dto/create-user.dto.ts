import { IsEnum, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchi telefon raqami',
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @IsString()
  fullName: string;


  @ApiPropertyOptional({
    example: 'ADMIN',
    enum: UserRole,
    enumName: 'UserRole',
    description: 'Foydalanuvchi roli (majburiy emas)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

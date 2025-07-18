import { IsEnum, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchi telefon raqami',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchi toliq ismi',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Foydalanuvchi profil rasmi URL manzili',
  })
  @IsString()
  image: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    enum: UserRole,
    description: 'Foydalanuvchi roli (majburiy emas)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

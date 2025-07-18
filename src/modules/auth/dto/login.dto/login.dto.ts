import { IsMobilePhone, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+998901234567', description: 'Foydalanuvchi telefon raqami' })
  @IsMobilePhone('uz-UZ')
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Foydalanuvchi paroli' })
  @IsString()
  password: string;
}

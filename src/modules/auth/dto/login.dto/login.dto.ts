import { IsMobilePhone, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+998905346012', description: 'Foydalanuvchi telefon raqami' })
  @IsMobilePhone('uz-UZ')
  phone: string;

  @ApiProperty({ example: 'abc123', description: 'Foydalanuvchi paroli' })
  @IsString()
  password: string;
}

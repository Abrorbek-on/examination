import { IsMobilePhone, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
  @IsMobilePhone('uz-UZ')
  phone: string;

  @ApiProperty({ example: '123456', description: 'OTP kodi (bir martalik parol)' })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'newPassword123', description: 'Yangi parol' })
  @IsString()
  password: string;
}

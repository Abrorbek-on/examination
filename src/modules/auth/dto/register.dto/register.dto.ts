import { IsEnum, IsMobilePhone, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: "+998901234567" })
  @IsMobilePhone('uz-UZ')
  phone: string;

  @ApiProperty({ example: "Abror Karimov" })
  @IsString()
  fullName: string;

  @ApiProperty({ example: "abc123" })
  @IsString()
  password: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  otp: string;

  @ApiProperty({ example: "https://cdn.site.com/image.jpg" })
  @IsString()
  image: string;

  @ApiProperty({ example: "STUDENT", enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

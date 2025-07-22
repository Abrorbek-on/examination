import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UsersQueryDto {
  @ApiPropertyOptional({ example: '0', description: 'Offset', type: String })
  @IsOptional()
  @IsString()
  offset?: string;

  @ApiPropertyOptional({ example: '10', description: 'Limit', type: String })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({ example: 'ali', description: 'Qidiruv matni', type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Foydalanuvchi roli',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

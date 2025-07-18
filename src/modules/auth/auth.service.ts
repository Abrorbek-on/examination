import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerificationService } from '../verification/verification.service';
import { EVerificationTypes } from 'src/common/types/verification';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private verificationService: VerificationService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingUser) {
      throw new BadRequestException('Phone already registered');
    }

    const isOtpValid = await this.verificationService.checkConfirmOtp({
      type: EVerificationTypes.REGISTER,
      phone: dto.phone,
      otp: dto.otp,
    }).catch(() => false);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        password: hashedPassword,
        fullName: dto.fullName,
        image: dto.image || '',
        role: dto.role || 'STUDENT',
      },
    });

    return this.getTokens(user.id, user.phone, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) {
      throw new UnauthorizedException('Phone or password is incorrect');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Phone or password is incorrect');
    }

    return this.getTokens(user.id, user.phone, user.role);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refresh_token, {
        secret: process.env.REFRESH_SECRET,
      });
      return this.getTokens(payload.sub, payload.phone, payload.role);
    } catch {
      throw new UnauthorizedException('Session expired');
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOtpValid = await this.verificationService.checkConfirmOtp({
      type: EVerificationTypes.RESET_PASSWORD,
      phone: dto.phone,
      otp: dto.otp,
    }).catch(() => false);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { phone: dto.phone },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  private async getTokens(userId: number, phone: string, role: string) {
    const payload = { sub: userId, phone, role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }
}

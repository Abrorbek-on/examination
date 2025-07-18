import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/core/database/prisma.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { SMSService } from 'src/common/services/sms.service';
import { VerificationModule } from 'src/modules/verification/verification.module'; 

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', 
      signOptions: { expiresIn: '1h' },
    }),
    VerificationModule,  
  ],
  providers: [AuthService, SMSService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

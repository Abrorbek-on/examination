import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { SMSService } from 'src/common/services/sms.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [VerificationController],
  providers: [VerificationService, SMSService],
  exports: [VerificationService]
})
export class VerificationModule {}

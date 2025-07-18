import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}

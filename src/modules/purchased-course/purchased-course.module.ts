import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PurchasedCourseService } from '../purchased-course/purchased-course.service';
import { PurchasedCourseController } from '../purchased-course/purchased-course.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [PurchasedCourseService],
  controllers: [PurchasedCourseController],
})
export class PurchasedCourseModule {}

import { Module } from '@nestjs/common';
import { PurchasedCourseController } from './purchased-course.controller';
import { PurchasedCourseService } from './purchased-course.service';

@Module({
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService]
})
export class PurchasedCourseModule {}

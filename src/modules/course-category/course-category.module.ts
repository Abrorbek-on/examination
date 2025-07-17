import { Module } from '@nestjs/common';
import { CourseCategoryController } from './course-category.controller';
import { CourseCategoryService } from './course-category.service';

@Module({
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService]
})
export class CourseCategoryModule {}

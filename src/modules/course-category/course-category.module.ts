import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryController } from './course-category.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [CourseCategoryService],
  controllers: [CourseCategoryController],
  
})
export class CourseCategoryModule {}


import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { CoursesController } from './course.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService, AuthModule],
})
export class CoursesModule {}

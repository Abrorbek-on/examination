
import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { CoursesController } from './course.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}

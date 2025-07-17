import { Module } from '@nestjs/common';
import { AssignedCourseController } from './assigned-course.controller';
import { AssignedCourseService } from './assigned-course.service';

@Module({
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService]
})
export class AssignedCourseModule {}

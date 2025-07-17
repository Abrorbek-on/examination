import { Module } from '@nestjs/common';
import { LessonGroupController } from './lesson-group.controller';
import { LessonGroupService } from './lesson-group.service';

@Module({
  controllers: [LessonGroupController],
  providers: [LessonGroupService]
})
export class LessonGroupModule {}

import { Module } from '@nestjs/common';
import { LessonViewController } from './lesson-view.controller';
import { LessonViewService } from './lesson-view.service';

@Module({
  controllers: [LessonViewController],
  providers: [LessonViewService]
})
export class LessonViewModule {}

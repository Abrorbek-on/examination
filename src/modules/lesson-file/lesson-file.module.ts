import { Module } from '@nestjs/common';
import { LessonFileController } from './lesson-file.controller';
import { LessonFileService } from './lesson-file.service';

@Module({
  controllers: [LessonFileController],
  providers: [LessonFileService]
})
export class LessonFileModule {}

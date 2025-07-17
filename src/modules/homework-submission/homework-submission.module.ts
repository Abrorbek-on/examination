import { Module } from '@nestjs/common';
import { HomeworkSubmissionController } from './homework-submission.controller';
import { HomeworkSubmissionService } from './homework-submission.service';

@Module({
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService]
})
export class HomeworkSubmissionModule {}

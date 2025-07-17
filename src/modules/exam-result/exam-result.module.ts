import { Module } from '@nestjs/common';
import { ExamResultController } from './exam-result.controller';
import { ExamResultService } from './exam-result.service';

@Module({
  controllers: [ExamResultController],
  providers: [ExamResultService]
})
export class ExamResultModule {}

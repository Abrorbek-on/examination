import { Module } from '@nestjs/common';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';

@Module({
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService]
})
export class QuestionAnswerModule {}

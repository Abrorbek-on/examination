import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; 
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [AuthModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}

import { Module } from '@nestjs/common';
import { ExamsController } from './exam.controller';
import { ExamsService } from './exam.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService]
})
export class ExamModule {}

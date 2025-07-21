import { Module } from '@nestjs/common';
import { ExamsController } from './exam.controller';
import { ExamsService } from './exam.service';
import { AuthGuard } from 'src/common/global/guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET })
  ],
  controllers: [ExamsController],
  providers: [ExamsService, AuthGuard],
})
export class ExamModule {}

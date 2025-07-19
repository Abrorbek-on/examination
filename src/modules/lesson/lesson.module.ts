import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthGuard } from "src/common/global/guard"
import { LessonsController } from "./lesson.controller"
import { LessonsService } from "./lesson.service"
import { AuthModule } from "../auth/auth.module"
@Module({
  imports: [AuthModule],
  controllers: [LessonsController],
  providers: [LessonsService, AuthGuard],
  exports: [LessonsService],
})
export class LessonsModule {}

import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { PrismaModule } from "src/core/database/prisma.module"
import { LessonFilesController } from "./lesson-file.controller"
import { LessonFilesService } from "./lesson-file.service"

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [LessonFilesController],
  providers: [LessonFilesService, AuthGuard, RoleGuard],
  exports: [LessonFilesService],
})
export class LessonFilesModule {}

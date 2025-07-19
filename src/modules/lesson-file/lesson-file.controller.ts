import { Controller, Get, Post, Body, Delete, Param, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { LessonFilesService } from "./lesson-file.service";
import { CreateLessonFileDto } from "./dto/upload-file.dto/upload-file.dto";

@ApiTags("Lesson Files")
@Controller("lesson-files")
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @Get('lesson/:lesson_id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dars fayllarini olish' })
  @ApiResponse({ status: 200, description: 'Dars fayllari royxati' })
  findByLesson(@Param('lesson_id') lessonId: string) {
    return this.lessonFilesService.findByLesson(+lessonId);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dars uchun fayl yuklash' })
  @ApiResponse({ status: 201, description: 'Fayl yuklandi' })
  create(@Body() createLessonFileDto: CreateLessonFileDto) {
    return this.lessonFilesService.create(createLessonFileDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dars faylini o\'chirish' })
  @ApiResponse({ status: 200, description: 'Fayl o\'chirildi' })
  remove(@Param('id') id: string) {
    return this.lessonFilesService.remove(+id);
  }
}

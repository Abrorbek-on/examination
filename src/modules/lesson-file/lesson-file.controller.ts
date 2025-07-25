import { Controller, Get, Post, Body, Delete, Param, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { LessonFilesService } from "./lesson-file.service";
import { CreateLessonFileDto } from "./dto/upload-file.dto/upload-file.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";

@ApiTags("Lesson Files")
@Controller("lesson-files")
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) { }

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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/file',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        note: {
          type: 'string',
          example: "Qo'shimcha fayl",
        },
        lessonId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Dars uchun fayl yuklash' })
  @ApiResponse({ status: 201, description: 'Fayl yuklandi' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { note?: string; lessonId: number },
  ) {
    return this.lessonFilesService.create({
      file: file.filename,
      note: body.note,
      lessonId: Number(body.lessonId),
    });
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

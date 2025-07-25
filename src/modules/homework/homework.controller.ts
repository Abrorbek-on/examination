import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HomeworkSubStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { HomeworkService } from '../homework/homework.service';
import { CreateHomeworkDto } from '../homework/dto/create-homework.dto/create-homework.dto';
import { UpdateHomeworkDto } from '../homework/dto/update-homework.dto/update-homework.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Homework')
@Controller('homework')
export class HomeworkController {
  constructor(private readonly service: HomeworkService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
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
        task: { type: 'string', example: 'Uyga vazifa' },
        file: { type: 'string', format: 'binary' },
        lessonId: { type: 'number', example: 5 }
      },
    },
  })
  @ApiOperation({ summary: 'Yangi uyga vazifa yaratish (fayl bilan)' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('task') task: string,
    @Body('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const fileName = file?.filename;

    return this.service.create({
      task,
      file: fileName,
      lessonId,
    });
  }



  @Get()
  @ApiOperation({ summary: 'Barcha uyga vazifalarni olish' })
  @ApiResponse({ status: 200, description: 'Barcha uyga vazifalar ro‘yxati' })
  getAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string
  ) {
    return this.service.getAll(+offset || 0, +limit || 10);
  }


  @Get(':id')
  @ApiOperation({ summary: 'ID orqali uyga vazifani olish' })
  @ApiResponse({ status: 200, description: 'Topilgan vazifa' })
  getById(@Param('id') id: number) {
    return this.service.getById(+id);
  }

  @Get('course/:id')
  @ApiOperation({ summary: 'Kurs ID boyicha vazifalarni olish' })
  @ApiResponse({ status: 200, description: 'Kursga tegishli vazifalar' })
  getByCourse(@Param('id') id: number) {
    return this.service.getByCourse(+id);
  }

  @Get('lesson/:id')
  @ApiOperation({ summary: 'Dars ID boyicha vazifalarni olish' })
  @ApiResponse({ status: 200, description: 'Darsga tegishli vazifalar' })
  getByLesson(@Param('id') id: number) {
    return this.service.getByLesson(+id);
  }

  @Post('my/:lessonId/:userId')
  @ApiOperation({ summary: 'Foydalanuvchining vazifa javobini olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchining vazifaga topshirigi' })
  getMySubmission(
    @Param('lessonId') lessonId: number,
    @Param('userId') userId: number,
  ) {
    return this.service.getMySubmission(+userId, +lessonId);
  }

  @Post('submit/:lessonId')
  @ApiOperation({ summary: 'Uyga vazifa topshirish' })
  @ApiResponse({ status: 201, description: 'Vazifa topshirildi' })
  submit(@Param('lessonId') lessonId: number, @Body() body: any) {
    return this.service.submit(+lessonId, body);
  }


  @Post('check')
  @ApiOperation({ summary: 'Uyga vazifani tekshirish (status berish)' })
  @ApiResponse({ status: 200, description: 'Vazifa baholandi' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        submissionId: { type: 'number', example: 1 },
        status: { type: 'string', enum: Object.keys(HomeworkSubStatus), example: 'ACCEPTED' },
        reason: { type: 'string', example: 'Yaxshi bajargan' },
      },
    },
  })
  check(
    @Body()
    body: {
      submissionId: number;
      status: string;
      reason?: string;
    },
  ) {
    const statusEnum = HomeworkSubStatus[body.status as keyof typeof HomeworkSubStatus];
    return this.service.check({
      ...body,
      status: statusEnum,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Uyga vazifani tahrirlash' })
  @ApiResponse({ status: 200, description: 'Vazifa yangilandi' })
  @ApiBody({ type: UpdateHomeworkDto })
  update(@Param('id') id: number, @Body() body: UpdateHomeworkDto) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Uyga vazifani ochirish' })
  @ApiResponse({ status: 200, description: 'Vazifa ochirildi' })
  delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}

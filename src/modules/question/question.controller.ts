import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/ask-question.dto/ask-question.dto';
import { UpdateQuestionDto } from './dto/update.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @ApiOperation({ summary: 'Barcha savollarni olish (pagination bilan)' })
  @Get()
  getAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    return this.questionService.getAll(+offset, +limit);
  }


  @ApiOperation({ summary: 'ID boyicha bitta savol olish' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.getOne(id);
  }

  @ApiOperation({ summary: 'Yangi savol yaratish' })
  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @ApiOperation({ summary: 'Savolni yangilash' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, dto);
  }

  @ApiOperation({ summary: 'Savolni ochirish' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.delete(id);
  }

  @ApiOperation({ summary: 'User ID boyicha savollarni olish' })
  @Get('/user/:userId')
  getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.questionService.getByUser(userId);
  }

  @ApiOperation({ summary: 'Course ID boyicha savollarni olish' })
  @Get('/course/:courseId')
  getByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.questionService.getByCourse(courseId);
  }

  @ApiOperation({ summary: 'Matn boyicha qidiruv' })
  @Get('/search/text')
  search(@Query('q') q: string) {
    return this.questionService.search(q);
  }

  @ApiOperation({ summary: 'Savolga fayl yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.questionService.uploadFile(id, file.filename);
  }
}

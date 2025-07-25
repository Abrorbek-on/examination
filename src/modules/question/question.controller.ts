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
  BadRequestException,
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

  @Post()
  @ApiOperation({ summary: 'Yangi savol yaratish' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'integer', example: 1 },
        courseId: { type: 'integer', example: 2 },
        text: { type: 'string', example: 'NestJS haqida savol' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/questions',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateQuestionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.questionService.create(dto, file?.filename);
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
        destination: './uploads/questionimage',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `question-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    return this.questionService.uploadFile(id, file.filename);
  }
}

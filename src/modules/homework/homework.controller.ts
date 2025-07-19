import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HomeworkSubStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HomeworkService } from '../homework/homework.service';
import { CreateHomeworkDto } from '../homework/dto/create-homework.dto/create-homework.dto';
import { UpdateHomeworkDto } from '../homework/dto/update-homework.dto/update-homework.dto';

@ApiTags('Homework')
@Controller('homework')
export class HomeworkController {
  constructor(private readonly service: HomeworkService) { }

  @Post()
  @ApiOperation({ summary: 'Yangi uyga vazifa yaratish' })
  @ApiResponse({ status: 201, description: 'Uyga vazifa yaratildi' })
  @ApiBody({ type: CreateHomeworkDto })
  create(@Body() body: CreateHomeworkDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha uyga vazifalarni olish' })
  @ApiResponse({ status: 200, description: 'Barcha uyga vazifalar royxati' })
  getAll() {
    return this.service.getAll();
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

  @Post('submit/:id')
  @ApiOperation({ summary: 'Uyga vazifa topshirish' })
  @ApiResponse({ status: 201, description: 'Vazifa topshirildi' })
  submit(@Param('id') id: number, @Body() body: any) {
    return this.service.submit(+id, body);
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

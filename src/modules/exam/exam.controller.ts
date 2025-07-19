import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/global/decarator';
import { UserRole } from '@prisma/client';
import { ExamsService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto/create-exam.dto';
import { Request } from 'express';

@ApiTags('Exams')
@ApiBearerAuth()
@Controller('api/exams')
export class ExamsController {
  constructor(private readonly service: ExamsService) {}

  @Get('lesson-group/:lessonGroupId')
  @ApiOperation({ summary: 'LessonGroup ID orqali examlar (STUDENT)' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  getByLessonGroup(@Param('lessonGroupId') lessonGroupId: string) {
    return this.service.getByLessonGroup(+lessonGroupId);
  }

  @Post('pass')
  @UseGuards(RoleGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Examni topshirish (STUDENT)' })
  @ApiBody({
    schema: {
      example: {
        lessonGroupId: 1,
        answers: [
          { examId: 1, selected: 'variantA' },
          { examId: 2, selected: 'variantC' },
        ],
      },
    },
  })
  passExam(@Body() data: any, @Req() req: Request) {
    const userId = req['user'].id;
    return this.service.passExam(data, userId);
  }

  @Get('lesson-group/details/:id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'LessonGroup examlarining toliq tafsiloti (MENTOR, ADMIN)' })
  getGroupDetails(@Param('id') id: string) {
    return this.service.getGroupDetails(+id);
  }

  @Get('detail/:id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bitta exam haqida toliq malumot' })
  getExam(@Param('id') id: string) {
    return this.service.getExam(+id);
  }

  @Post('create')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Bitta exam yaratish' })
  @ApiBody({ type: CreateExamDto })
  create(@Body() dto: CreateExamDto) {
    return this.service.create(dto);
  }

  @Post('create/many')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Kop examni birga yaratish' })
  @ApiBody({
    schema: {
      example: {
        exams: [
          {
            question: 'Capital of France?',
            variantA: 'Paris',
            variantB: 'London',
            variantC: 'Berlin',
            variantD: 'Madrid',
            answer: 'variantA',
            lessonGroupId: 1,
          },
        ],
      },
    },
  })
  createMany(@Body() body: { exams: CreateExamDto[] }) {
    return this.service.createMany(body.exams);
  }

  @Patch('update/:id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Examni tahrirlash' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateExamDto })
  update(@Param('id') id: string, @Body() dto: CreateExamDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Examni ochirish' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }

  @Get('results')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Barcha exam natijalari (ADMIN)' })
  getResults() {
    return this.service.getAllResults();
  }

  @Get('results/lesson-group/:id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR)
  @ApiOperation({ summary: 'LessonGroup boyicha natijalar (MENTOR)' })
  @ApiParam({ name: 'id', type: Number })
  getResultsByGroup(@Param('id') id: string) {
    return this.service.getResultsByGroup(+id);
  }
}

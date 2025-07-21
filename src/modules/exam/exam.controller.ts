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
import { AuthGuard } from 'src/common/global/guard';

@ApiTags('Exams')
@ApiBearerAuth()
@Controller('api/exams')
export class ExamsController {
  constructor(private readonly examservice: ExamsService) { }

  @Get('lesson-group/:lessonGroupId')
  @ApiOperation({ summary: 'LessonGroup ID orqali examlar (STUDENT)' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  getByLessonGroup(@Param('lessonGroupId') lessonGroupId: string) {
    return this.examservice.getByLessonGroup(+lessonGroupId);
  }

  @Post('pass')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
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
    const userId = req['user'].sub;    
    return this.examservice.passExam(data, userId);
  }

  @Get('lesson-group/details/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'LessonGroup examlarining toliq tafsiloti (MENTOR, ADMIN)' })
  getGroupDetails(@Param('id') id: string) {
    return this.examservice.getGroupDetails(+id);
  }

  @Get('detail/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Bitta exam haqida toliq malumot' })
  getExam(@Param('id') id: string) {
    return this.examservice.getExam(+id);
  }

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Bitta exam yaratish' })
  // @ApiBody({ type: CreateExamDto })
  create(@Body() dto: CreateExamDto) {
    return this.examservice.create(dto);
  }

  @Post('create/many')
  @UseGuards(AuthGuard, RoleGuard)
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
    return this.examservice.createMany(body.exams);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Examni tahrirlash' })
  @ApiParam({ name: 'id', type: Number })
  // @ApiBody({ type: CreateExamDto })
  update(@Param('id') id: string, @Body() dto: CreateExamDto) {
    return this.examservice.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Examni ochirish' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id') id: string) {
    return this.examservice.delete(+id);
  }

  @Get('results')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Barcha exam natijalari (ADMIN)' })
  getResults() {
    return this.examservice.getAllResults();
  }

  @Get('results/lesson-group/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MENTOR)
  @ApiOperation({ summary: 'LessonGroup boyicha natijalar (MENTOR)' })
  @ApiParam({ name: 'id', type: Number })
  getResultsByGroup(@Param('id') id: string) {
    return this.examservice.getResultsByGroup(+id);
  }
}

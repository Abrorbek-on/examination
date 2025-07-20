import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/global/decarator';
import { AuthGuard } from 'src/common/global/guard';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Hamma nashr qilingan kurslarni olish' })
  getAll() {
    return this.service.getAllPublished();
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Kursni ID orqali olish (faqat nashr qilingan)' })
  getSingle(@Param('id') id: string) {
    return this.service.getSingle(+id);
  }

  @Get('single-full/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR', 'ASSISTANT')
  @ApiOperation({ summary: 'Kurs haqida toliq maʼlumot (rolga asoslangan)' })
  getFull(@Param('id') id: string) {
    return this.service.getFull(+id);
  }

  @Get('all')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Barcha kurslarni olish (admin)' })
  getAllAdmin() {
    return this.service.getAllAdmin();
  }

  @Get('my')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Mentorning oz kurslarini olish' })
  getMyCourses(@Request() req) {
    return this.service.getMyCourses(req.user.id);
  }

  @Get('mentor/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Berilgan mentorga tegishli kurslar' })
  getMentorCourses(@Param('id') id: string) {
    return this.service.getMentorCourses(+id);
  }

  @Get('my/assigned')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ASSISTANT')
  @ApiOperation({ summary: 'Assistantga biriktirilgan kurslar' })
  getAssignedCourses(@Request() req) {
    return this.service.getAssignedCourses(req.user.id);
  }

  @Get(':courseId/assistants')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursga biriktirilgan assistantlar' })
  getAssistants(@Param('courseId') courseId: string) {
    return this.service.getAssistants(+courseId);
  }

  @Post('assign-assistant')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursga assistant biriktirish' })
  @ApiBody({
    schema: {
      example: {
        courseId: 1,
        userId: 3,
      },
    },
  })
  assignAssistant(@Body() body: { courseId: number; userId: number }) {
    return this.service.assignAssistant(body.courseId, body.userId);
  }

  @Post('unassign-assistant')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursdan assistantni ajratish' })
  @ApiBody({
    schema: {
      example: {
        courseId: 1,
        userId: 3,
      },
    },
  })
  unassignAssistant(@Body() body: { courseId: number; userId: number }) {
    return this.service.unassignAssistant(body.courseId, body.userId);
  }

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Yangi kurs yaratish' })
  @ApiBody({ type: CreateCourseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.service.create(dto);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursni tahrirlash' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseDto })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.update(+id, dto);
  }

  @Post('publish/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kursni nashr qilish' })
  @ApiParam({ name: 'id', type: Number })
  publish(@Param('id') id: string) {
    return this.service.publish(+id);
  }

  @Post('unpublish/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kursni nashr qilinmagan holatga otkazish' })
  @ApiParam({ name: 'id', type: Number })
  unpublish(@Param('id') id: string) {
    return this.service.unpublish(+id);
  }

  @Patch('update-mentor')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kurs mentorini almashtirish' })
  @ApiBody({
    schema: {
      example: {
        courseId: 1,
        mentorId: 5,
      },
    },
  })
  updateMentor(@Body() body: { courseId: number; mentorId: number }) {
    return this.service.updateMentor(body.courseId, body.mentorId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursni ochirish' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}

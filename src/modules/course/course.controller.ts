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
  Query,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/global/decarator';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/global/guard';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) { }

  @ApiOperation({ summary: 'Filter va pagination bilan savollar ro‘yxati' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'mentorId', required: false, type: Number })
  @ApiQuery({ name: 'priceMin', required: false, type: Number })
  @ApiQuery({ name: 'priceMax', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  getAll(
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('categoryId') categoryId?: number,
    @Query('mentorId') mentorId?: number,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    return this.service.getAll({
      search,
      level,
      categoryId,
      mentorId,
      priceMin,
      priceMax,
      offset: +offset,
      limit: +limit,
    });
  }


  @Get('single/:id')
  @ApiOperation({ summary: 'Kursni ID orqali olish (faqat nashr qilingan)' })
  getSingle(@Param('id') id: string) {
    return this.service.getSingle(+id);
  }

  @Get('single-full/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR', 'ASSISTANT')
  @ApiOperation({ summary: 'Kurs haqida toliq malumot (rolga asoslangan)' })
  getFull(@Param('id') id: string) {
    return this.service.getFull(+id);
  }

  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'level',
    required: false,
    type: String,
    enum: [
      'BEGINNER',
      'PRE_INTERMEDIATE',
      'INTERMEDIATE',
      'UPPER_INTERMEDIATE',
      'ADVANCED',
    ],
  })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'mentor_id', required: false, type: Number })
  @ApiQuery({ name: 'price_min', required: false, type: Number })
  @ApiQuery({ name: 'price_max', required: false, type: Number })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @Get('all')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Barcha kurslarni olish (admin)' })
  getAllAdmin(
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('category_id') categoryId?: number,
    @Query('mentor_id') mentorId?: number,
    @Query('price_min') priceMin?: number,
    @Query('price_max') priceMax?: number,
    @Query('published') published?: boolean,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.service.getAllAdmin({
      search,
      level,
      categoryId,
      mentorId,
      priceMin,
      priceMax,
      published,
      offset: +offset,
      limit: +limit,
    });
  }


  @Get('my')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Mentorning o‘z kurslarini olish' })
  getMyCourses(
    @Request() req,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('category_id') categoryId?: string,
    @Query('price_min') priceMin?: string,
    @Query('price_max') priceMax?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getMyCourses(req.user.id, {
      search,
      level,
      categoryId: categoryId ? +categoryId : undefined,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
      offset: offset ? +offset : 0,
      limit: limit ? +limit : 10,
    });
  }


  @Get('mentor/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Berilgan mentorga tegishli kurslarni olish' })
  getMentorCourses(@Param('id') id: string) {
    return this.service.getMentorCourses(+id);
  }

  @Get('my/assigned')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR', 'ASSISTANT')
  @ApiOperation({ summary: 'Assistantga biriktirilgan kurslarni olish' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'level',
    required: false,
    type: String,
    enum: [
      'BEGINNER',
      'PRE_INTERMEDIATE',
      'INTERMEDIATE',
      'UPPER_INTERMEDIATE',
      'ADVANCED',
    ],
  })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'mentor_id', required: false, type: Number })
  @ApiQuery({ name: 'price_min', required: false, type: Number })
  @ApiQuery({ name: 'price_max', required: false, type: Number })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  getAssignedCourses(
    @Request() req,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('category_id') categoryId?: string,
    @Query('mentor_id') mentorId?: string,
    @Query('price_min') priceMin?: string,
    @Query('price_max') priceMax?: string,
    @Query('published') published?: string,
  ) {
    return this.service.getAssignedCourses(req.user.id, {
      offset: offset ? +offset : 0,
      limit: limit ? +limit : 10,
      search,
      level,
      categoryId: categoryId ? +categoryId : undefined,
      mentorId: mentorId ? +mentorId : undefined,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
      published: published !== undefined ? published === 'true' : undefined,
    });
  }


  @Get(':courseId/assistants')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Kursga biriktirilgan assistantlarni olish' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getAssistants(
    @Param('courseId') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getAssistants(+courseId, {
      offset: offset ? +offset : 0,
      limit: limit ? +limit : 10,
    });
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
  @ApiBearerAuth()
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
  @ApiBody({
    type: UpdateCourseDto,
  })
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
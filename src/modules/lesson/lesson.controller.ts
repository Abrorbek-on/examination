import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Roles } from 'src/common/global/decarator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateLessonDto } from './dto/create-lesson.dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto/update-lesson.dto';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Create new lesson (ADMIN, MENTOR)' })
  create(@Body() body: CreateLessonDto) {
    return this.lessonService.create(body);
  }

  @Get('single/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get single lesson by student (STUDENT)' })
  @ApiParam({ name: 'lessonId', type: 'number' })
  getSingle(@Param('lessonId') id: string) {
    return this.lessonService.getOne(+id);
  }

  @Put('view/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'View lesson - mark as viewed (STUDENT)' })
  @ApiParam({ name: 'lessonId', type: 'number' })
  viewLesson(@Param('lessonId') id: string) {
    return this.lessonService.view(+id);
  }

  @Get('detail/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Get lesson detail (ADMIN, MENTOR)' })
  @ApiParam({ name: 'id', type: 'number' })
  getDetail(@Param('id') id: string) {
    return this.lessonService.getOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Update lesson (ADMIN, MENTOR)' })
  @ApiParam({ name: 'id', type: 'number' })
  update(@Param('id') id: string, @Body() body: UpdateLessonDto) {
    return this.lessonService.update(+id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Delete lesson (ADMIN, MENTOR)' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}

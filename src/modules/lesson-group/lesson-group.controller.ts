import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Param, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { Roles } from "src/common/global/decarator"
import { LessonGroupsService } from "./lesson-group.service"
import { CreateLessonGroupDto } from "./dto/create-lesson-group.dto/create-lesson-group.dto"
import { UpdateLessonGroupDto } from "./dto/update-lesson-group.dto/update-lesson-group.dto"

@ApiTags("Lesson Groups")
@Controller("lesson-group")
export class LessonGroupsController {
  constructor(private readonly lessonGroupsService: LessonGroupsService) { }

  @Get('list/:courseId')
  findAll(
    @Param('courseId') courseId: number,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedOffset = offset ? Number(offset) : 0;
    const parsedLimit = limit ? Number(limit) : 10;

    return this.lessonGroupsService.findAll(+courseId, parsedOffset, parsedLimit);
  }


  @Get("mine-all/:course_id")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("ADMIN")
  @ApiOperation({ summary: "ADMIN uchun kurs bo'yicha dars guruhlarini olish" })
  @ApiResponse({ status: 200, description: "ADMIN dars guruhlari" })
  findMineAll(
    @Param('course_id') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedOffset = offset ? Number(offset) : 0;
    const parsedLimit = limit ? Number(limit) : 10;

    return this.lessonGroupsService.findAll(+courseId, parsedOffset, parsedLimit);
  }


  @ApiOperation({ summary: "Dars guruhi tafsilotlarini olish" })
  @ApiResponse({ status: 200, description: "Dars guruhi tafsilotlari" })
  @Get('first/:course_id')
  findFirstByCourse(@Param('course_id') courseId: string) {
    return this.lessonGroupsService.findOne(+courseId);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("MENTOR", "ADMIN")
  @ApiOperation({ summary: "Yangi dars guruhi yaratish" })
  @ApiResponse({ status: 201, description: "Dars guruhi yaratildi" })
  create(@Body() createLessonGroupDto: CreateLessonGroupDto) {
    return this.lessonGroupsService.create(createLessonGroupDto)
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("MENTOR", "ADMIN")
  @ApiOperation({ summary: "Dars guruhini yangilash" })
  @ApiResponse({ status: 200, description: "Dars guruhi yangilandi" })
  update(id: string, @Body() updateLessonGroupDto: UpdateLessonGroupDto) {
    return this.lessonGroupsService.update(+id, updateLessonGroupDto)
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("MENTOR", "ADMIN")
  @ApiOperation({ summary: "Dars guruhini o'chirish" })
  @ApiResponse({ status: 200, description: "Dars guruhi o'chirildi" })
  @ApiParam({ name: 'id', type: Number, description: "O'chiriladigan dars guruhi ID raqami" })
  remove(@Param('id') id: string) {
    return this.lessonGroupsService.remove(+id);
  }

}
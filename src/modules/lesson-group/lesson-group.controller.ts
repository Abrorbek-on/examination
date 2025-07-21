import { Controller, Get, Post, Body, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { Roles } from "src/common/global/decarator"
import { LessonGroupsService } from "./lesson-group.service"
import { CreateLessonGroupDto } from "./dto/create-lesson-group.dto/create-lesson-group.dto"
import { UpdateLessonGroupDto } from "./dto/update-lesson-group.dto/update-lesson-group.dto"

@ApiTags("Lesson Groups")
@Controller("lesson-group")
export class LessonGroupsController {
  constructor(private readonly lessonGroupsService: LessonGroupsService) {}

  @Get("all/:course_id")
  @ApiOperation({ summary: "Kurs bo'yicha barcha dars guruhlarini olish" })
  @ApiResponse({ status: 200, description: "Dars guruhlari royxati" })
  findAll(courseId: string) {
    return this.lessonGroupsService.findAll(+courseId)
  }

  @Get("mine-all/:course_id")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("STUDENT")
  @ApiOperation({ summary: "Student uchun kurs bo'yicha dars guruhlarini olish" })
  @ApiResponse({ status: 200, description: "Student dars guruhlari" })
  findMineAll(courseId: string) {
    return this.lessonGroupsService.findAll(+courseId)
  }

  @Get("detail/:id")
  @ApiOperation({ summary: "Dars guruhi tafsilotlarini olish" })
  @ApiResponse({ status: 200, description: "Dars guruhi tafsilotlari" })
  findOne(id: string) {
    return this.lessonGroupsService.findOne(+id)
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
  remove(id: string) {
    return this.lessonGroupsService.remove(+id)
  }
}
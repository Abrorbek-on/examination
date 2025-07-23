import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger"
import { AuthGuard } from "src/common/global/guard"
import { RoleGuard } from "src/common/guard/role.guard"
import { Roles } from "src/common/global/decarator"
import { LessonsService } from "./lesson.service"
import { CreateLessonDto } from "./dto/create-lesson.dto/create-lesson.dto"
import { UpdateLessonDto } from "./dto/update-lesson.dto/update-lesson.dto"

@ApiTags("Lessons")
@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Get('single/:lessonId')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Darsni ID orqali olish (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Topilgan dars' })
  getSingle(@Param('lessonId') lessonId: string) {
    return this.lessonsService.findOne(+lessonId);
  }

  @Put("view/:lessonId")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Darsni ko'rilgan deb belgilash" })
  @ApiResponse({ status: 200, description: "Dars ko'rilgan deb belgilandi" })
  @ApiParam({ name: 'lessonId', type: Number, description: "Ko'rilgan deb belgilanadigan dars ID raqami" })
  markAsViewed(
    @Param('lessonId') lessonId: string,
    @Body() body: { userId: number }
  ) {
    return this.lessonsService.markAsViewed(+lessonId, body.userId);
  }


  @Get('detail/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Dars tafsilotlarini olish' })
  @ApiResponse({ status: 200, description: 'Dars tafsilotlari' })
  getDetail(@Param('id') id: string) {
    return this.lessonsService.findOneWithDetails(+id);
  }

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Yangi dars yaratish' })
  @ApiResponse({ status: 201, description: 'Dars yaratildi' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles("ADMIN", "MENTOR")
  @ApiOperation({ summary: "Darsni yangilash" })
  @ApiResponse({ status: 200, description: "Dars yangilandi" })
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(+id, updateLessonDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Darsni ochirish' })
  @ApiResponse({ status: 200, description: 'Dars ochirildi' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }
}

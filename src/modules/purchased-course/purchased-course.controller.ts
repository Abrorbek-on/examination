import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/global/decarator";
import { RoleGuard } from "src/common/guard/role.guard";
import { AuthGuard } from "src/common/global/guard";
import { PurchasedCourseService } from "./purchased-course.service";
import { CreatePurchasedCourseDto, PurchaseCourseDto } from "./dto/buy-course.dto/buy-course.dto";

@ApiTags('Purchased Courses')
@Controller('purchased-courses')
export class PurchasedCourseController {
  constructor(private readonly purchasedCourseService: PurchasedCourseService) {}

  @Get('mine')
  @Roles('STUDENT')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my purchased courses (STUDENT)' })
  getMine(@Body('userId') userId: number) {
    return this.purchasedCourseService.getMine(userId);
  }

  @Get('mine/:course_id')
  @Roles('STUDENT')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my single purchased course (STUDENT)' })
  getMineById(@Body('userId') userId: number, @Param('course_id') courseId: number) {
    return this.purchasedCourseService.getMineById(userId, courseId);
  }

  @Post('purchase')
  @Roles('STUDENT')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase course (STUDENT)' })
  purchase(@Body('userId') userId: number, @Body() dto: PurchaseCourseDto) {
    return this.purchasedCourseService.purchase(userId, dto);
  }

  @Get(':id/students')
  @Roles('MENTOR', 'ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get students for a course (MENTOR, ADMIN)' })
  getStudents(@Param('id') courseId: number) {
    return this.purchasedCourseService.getStudents(courseId);
  }

  @Post('create')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin creates purchased course' })
  create(@Body() dto: CreatePurchasedCourseDto) {
    return this.purchasedCourseService.create(dto);
  }
}

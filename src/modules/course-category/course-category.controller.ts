import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/global/decarator";
import { RoleGuard } from "src/common/guard/role.guard";
import { AuthGuard } from "src/common/global/guard";
import { CourseCategoryService } from "./course-category.service";
import { CreateCourseCategoryDto } from "./dto/create-course-category.dto/create-course-category.dto";
import { UpdateCourseCategoryDto } from "./dto/update-course-category.dto/update-course-category.dto";

@ApiTags('Course Category')
@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Get('all')
  @ApiOperation({ summary: 'List all course categories' })
  getAll() {
    return this.courseCategoryService.getAll();
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get a single course category by ID' })
  getById(@Param('id') id: number) {
    return this.courseCategoryService.getById(id);
  }
  

  @Post()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category (ADMIN)' })
  create(@Body() dto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (ADMIN)' })
  update(@Param('id') id: number, @Body() dto: UpdateCourseCategoryDto) {
    return this.courseCategoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (ADMIN)' })
  remove(@Param('id') id: number) {
    return this.courseCategoryService.remove(id);
  }
}

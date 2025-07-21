import { Controller, Get, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/global/decarator";
import { RoleGuard } from "src/common/guard/role.guard";
import { AuthGuard } from "src/common/global/guard";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/rate.dto/rate.dto";

@ApiTags('Course Rating')
@Controller('course-rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @Get('latest')
  @ApiOperation({ summary: 'Latest ratings' })
  getLatest() {
    return this.ratingService.getLatest();
  }

  @Get('list/:course_id')
  @ApiOperation({ summary: 'Course ratings list' })
  getList(@Param('course_id') courseId: string) {
    return this.ratingService.getList(+courseId);
  }

  @Get('analytics/:course_id')
  @ApiOperation({ summary: 'Course rating analytics' })
  getAnalytics(@Param('course_id') courseId: string) {
    return this.ratingService.getAnalytics(+courseId);
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit rating (ADMIN)' })
  create(@Body() dto: CreateRatingDto) {
    return this.ratingService.create(dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rating (ADMIN)' })
  delete(@Param('id') id: string) {
    return this.ratingService.delete(+id);
  }
}

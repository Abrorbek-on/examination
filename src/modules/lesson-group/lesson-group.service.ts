import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto/update-lesson-group.dto';

@Injectable()
export class LessonGroupsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLessonGroupDto: CreateLessonGroupDto) {
    const { courseId, name } = createLessonGroupDto;

    if (!courseId || isNaN(Number(courseId))) {
      throw new BadRequestException('courseId notogri');
    }

    if (!name || typeof name !== 'string') {
      throw new BadRequestException('name bosh bolishi mumkin emas');
    }

    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      throw new BadRequestException('courseId mavjud emas');
    }

    return this.prisma.lessonGroup.create({
      data: createLessonGroupDto,
      include: {
        course: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });
  }


  async findAll(courseId: number, offset = 0, limit = 10) {
    if (!courseId || isNaN(Number(courseId))) {
      throw new BadRequestException('courseId notogri kiritilgan');
    }

    const lessonGroups = await this.prisma.lessonGroup.findMany({
      where: {
        courseId: Number(courseId),
      },
      include: {
        lessons: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (lessonGroups.length === 0) {
      throw new NotFoundException(`courseId ${courseId} boyicha hech qanday dars guruhi topilmadi`);
    }

    return lessonGroups;
  }


  async findOne(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('id notogri');
    }

    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id },
    });

    if (!lessonGroup) {
      throw new NotFoundException(`LessonGroup id ${id} topilmadi`);
    }

    return lessonGroup;
  }

  async update(id: number, updateLessonGroupDto: UpdateLessonGroupDto) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('id notogri');
    }

    await this.findOne(id);

    return this.prisma.lessonGroup.update({
      where: { id },
      data: updateLessonGroupDto,
      include: {
        course: true,
        _count: { select: { lessons: true } },
      },
    });
  }

  async remove(id: number) {
    if (!id || isNaN(+id)) {
      throw new BadRequestException('id notogri');
    }

    await this.findOne(id);

    await this.prisma.examResult.deleteMany({
      where: { lessonGroupId: id },
    });

    return this.prisma.lessonGroup.delete({
      where: { id },
    });
  }


}

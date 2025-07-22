import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';


@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) { }

  async getAll(params: {
    search?: string;
    level?: string;
    categoryId?: number;
    mentorId?: number;
    priceMin?: number;
    priceMax?: number;
    offset?: number;
    limit?: number;
  }) {
    const {
      search,
      level,
      categoryId,
      mentorId,
      priceMin,
      priceMax,
      offset = 0,
      limit = 10,
    } = params;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (mentorId) {
      where.mentorId = mentorId;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          mentor: true,
        },
      }),
    ]);

    return {
      totalCount,
      offset,
      limit,
      data,
    };
  }

  getSingle(id: number) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  getFull(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        mentor: true,
        lessonGroup: { include: { lessons: true } },
        rating: true,
      },
    });
  }

  async getAllAdmin(params: {
    search?: string;
    level?: string;
    categoryId?: number;
    mentorId?: number;
    priceMin?: number;
    priceMax?: number;
    published?: boolean;
    offset?: number;
    limit?: number;
  }) {
    const {
      search,
      level,
      categoryId,
      mentorId,
      priceMin,
      priceMax,
      published,
      offset = 0,
      limit = 10,
    } = params;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (mentorId) {
      where.mentorId = Number(mentorId);
    }

    if (published !== undefined) {
      where.published = published;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = Number(priceMin);
      if (priceMax !== undefined) where.price.lte = Number(priceMax);
    }

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          mentor: true,
        },
      }),
    ]);

    return {
      totalCount,
      offset,
      limit,
      data,
    };
  }


  async getMyCourses(
    mentorId: number,
    params?: {
      search?: string;
      level?: string;
      categoryId?: number;
      priceMin?: number;
      priceMax?: number;
      offset?: number;
      limit?: number;
    }
  ) {
    const {
      search,
      level,
      categoryId,
      priceMin,
      priceMax,
      offset = 0,
      limit = 10,
    } = params || {};

    const where: any = { mentorId };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    const [totalCount, data] = await this.prisma.$transaction([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
    ]);

    return {
      totalCount,
      offset,
      limit,
      data,
    };
  }



  getMentorCourses(mentorId: number) {
    return this.getMyCourses(mentorId);
  }

  getAssignedCourses(userId: number) {
    return this.prisma.assignedCourse.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  getAssistants(courseId: number) {
    return this.prisma.assignedCourse.findMany({
      where: { courseId },
      include: { user: true },
    });
  }

  assignAssistant(courseId: number, userId: number) {
    return this.prisma.assignedCourse.create({ data: { courseId, userId } });
  }

  unassignAssistant(courseId: number, userId: number) {
    return this.prisma.assignedCourse.deleteMany({
      where: { courseId, userId },
    });
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        name: dto.name,
        about: dto.about,
        price: dto.price,
        banner: dto.banner,
        introVideo: dto.introVideo,
        level: dto.level,
        categoryId: dto.categoryId,
        mentorId: dto.mentorId,
        published: dto.published,
      },
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }
  publish(id: number) {
    return this.prisma.course.update({ where: { id }, data: { published: true } });
  }

  unpublish(id: number) {
    return this.prisma.course.update({ where: { id }, data: { published: false } });
  }

  updateMentor(courseId: number, mentorId: number) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { mentorId },
    });
  }

  async delete(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Bunday kurs topilmadi');
    }

    await this.prisma.lessonGroup.deleteMany({
      where: { courseId: id },
    });

    await this.prisma.question.deleteMany({
      where: { courseId: id },
    });

    return this.prisma.course.delete({
      where: { id },
    });
  }

}

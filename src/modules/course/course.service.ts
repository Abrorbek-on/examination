import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  async getSingle(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID notogri');
    }

    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return course;
  }

  async getFull(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID notogri');
    }

    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        mentor: true,
        lessonGroup: { include: { lessons: true } },
        rating: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return course;
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

    if (isNaN(offset) || offset < 0 || isNaN(limit) || limit <= 0) {
      throw new BadRequestException('Offset yoki limit notogri');
    }

    if (
      priceMin !== undefined &&
      priceMax !== undefined &&
      Number(priceMin) > Number(priceMax)
    ) {
      throw new BadRequestException('priceMin priceMax dan katta bolishi mumkin emas');
    }

    if (categoryId !== undefined && isNaN(Number(categoryId))) {
      throw new BadRequestException('categoryId notogri');
    }

    if (mentorId !== undefined && isNaN(Number(mentorId))) {
      throw new BadRequestException('mentorId notogri');
    }

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


  async getMyCourses(mentorId: number, params?: {
    search?: string;
    level?: string;
    categoryId?: number;
    priceMin?: number;
    priceMax?: number;
    offset?: number;
    limit?: number;
  }) {
    const {
      search,
      level,
      categoryId,
      priceMin,
      priceMax,
      offset = 0,
      limit = 10,
    } = params || {};

    const assignedCourses = await this.prisma.assignedCourse.findMany({
      where: { userId: mentorId },
      select: { courseId: true },
    });

    const courseIds = assignedCourses.map(ac => ac.courseId);

    if (courseIds.length === 0) {
      return {
        totalCount: 0,
        offset,
        limit,
        data: [],
      };
    }

    const where: any = {
      id: { in: courseIds },
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (categoryId !== undefined) {
      where.categoryId = Number(categoryId);
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
    if (!mentorId || typeof mentorId !== 'number') throw new Error('Invalid mentor ID');
    return this.getMyCourses(mentorId);
  }


  async getAssignedCourses(
    userId: number,
    params: {
      offset?: number;
      limit?: number;
      search?: string;
      level?: string;
      categoryId?: number;
      mentorId?: number;
      priceMin?: number;
      priceMax?: number;
      published?: boolean;
    }
  ) {
    const {
      offset = 0,
      limit = 10,
      search,
      level,
      categoryId,
      mentorId,
      priceMin,
      priceMax,
      published,
    } = params;

    const where: any = {
      userId,
      course: {
        AND: [],
      },
    };

    if (search) {
      where.course.AND.push({ name: { contains: search, mode: 'insensitive' } });
    }

    if (level) {
      where.course.AND.push({ level });
    }

    if (categoryId !== undefined) {
      where.course.AND.push({ categoryId });
    }

    if (mentorId !== undefined) {
      where.course.AND.push({ mentorId });
    }

    if (published !== undefined) {
      where.course.AND.push({ published });
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      const priceFilter: any = {};
      if (priceMin !== undefined) priceFilter.gte = priceMin;
      if (priceMax !== undefined) priceFilter.lte = priceMax;
      where.course.AND.push({ price: priceFilter });
    }

    if (where.course.AND.length === 0) {
      delete where.course.AND;
    }

    const data = await this.prisma.assignedCourse.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        course: {
          include: {
            category: true,
            mentor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.assignedCourse.count({
      where,
    });

    return {
      totalCount,
      offset,
      limit,
      data,
    };
  }

  async getAssistants(
    courseId: number,
    params: { offset?: number; limit?: number } = {}
  ) {
    const { offset = 0, limit = 10 } = params;

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return this.prisma.assignedCourse.findMany({
      where: { courseId },
      skip: offset,
      take: limit,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }


  async assignAssistant(courseId: number, userId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new BadRequestException(`Course with ID ${courseId} not found`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    return this.prisma.assignedCourse.create({
      data: {
        courseId,
        userId,
      },
    });
  }


  async unassignAssistant(courseId: number, userId: number) {
    if (!courseId || !userId) {
      throw new HttpException('courseId yoki userId berilmagan', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.prisma.assignedCourse.findFirst({
      where: { courseId, userId },
    });

    if (!exists) {
      throw new HttpException('Bunday biriktirish topilmadi', HttpStatus.NOT_FOUND);
    }

    return this.prisma.assignedCourse.deleteMany({
      where: { courseId, userId },
    });
  }

  async create(dto: CreateCourseDto) {
    const categoryExists = await this.prisma.courseCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new HttpException('Kategoriya topilmadi', HttpStatus.BAD_REQUEST);
    }

    const mentorExists = await this.prisma.user.findUnique({
      where: { id: dto.mentorId },
    });

    if (!mentorExists || mentorExists.role !== 'MENTOR') {
      throw new HttpException('Mentor topilmadi', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.course.create({
      data: { ...dto },
    });
  }


  async update(id: number, dto: UpdateCourseDto) {
  const course = await this.prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundException(`Course not found (id: ${id})`);

  const [categoryExists, mentorIsValid] = await Promise.all([
    dto.categoryId ? this.prisma.courseCategory.count({ where: { id: dto.categoryId } }) : 1,
    dto.mentorId ? this.prisma.user.count({ where: { id: dto.mentorId, role: 'MENTOR' } }) : 1,
  ]);

  if (!categoryExists) throw new NotFoundException(`Kategoriya topilmadi (id: ${dto.categoryId})`);
  if (!mentorIsValid) throw new NotFoundException(`Mentor topilmadi yoki notogri (id: ${dto.mentorId})`);

  return this.prisma.course.update({ where: { id }, data: dto });
}



  async publish(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return this.prisma.course.update({
      where: { id },
      data: { published: true },
    });
  }


  async unpublish(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return this.prisma.course.update({
      where: { id },
      data: { published: false },
    });
  }

  async updateMentor(courseId: number, mentorId: number) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }
    const existingMentor = await this.prisma.user.findUnique({
      where: { id: mentorId },
    });

    if (!existingMentor || existingMentor.role !== 'MENTOR') {
      throw new NotFoundException(`Mentor with id ${mentorId} not found`);
    }
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

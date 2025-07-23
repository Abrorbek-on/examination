import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreatePurchasedCourseDto, PurchaseCourseDto } from "./dto/buy-course.dto/buy-course.dto";
import { GetMyPurchasedCoursesDto, GetStudentsDto } from "./dto/purchase.course.dto";
import { CourseLevel } from "@prisma/client";
import { Prisma } from "generated/prisma";

@Injectable()
export class PurchasedCourseService {
  constructor(private readonly prisma: PrismaService) { }

  async getMine(userId: number, query: GetMyPurchasedCoursesDto) {
    const { offset = 0, limit = 10, search, courseId } = query;

    const whereClause: any = {
      userId,
      ...(courseId && { courseId }),
      ...(search && {
        course: {
          name: { contains: search, mode: 'insensitive' },
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchasedCourse.findMany({
        skip: offset,
        take: limit,
        where: whereClause,
        include: {
          course: true,
        },
      }),
      this.prisma.purchasedCourse.count({
        where: whereClause,
      }),
    ]);

    return {
      total,
      offset,
      limit,
      data: data.map((item) => ({
        id: item.course.id,
        name: item.course.name,
        createdAt: item.course.createdAt,
      })),
    };
  }


  async getMineById(userId: number, courseId: number) {
    const purchase = await this.prisma.purchasedCourse.findFirst({
      where: { userId, courseId },
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  async purchase(userId: number, dto: PurchaseCourseDto) {
    const exists = await this.prisma.purchasedCourse.findFirst({
      where: { userId, courseId: dto.courseId },
    });
    if (exists) throw new BadRequestException('Course already purchased');

    return this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia,
        purchasedAt: new Date(),
      },
    });
  }

  async getStudents(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return this.prisma.purchasedCourse.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });
  }



    async create(dto: CreatePurchasedCourseDto) {
    return this.prisma.purchasedCourse.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia,
        purchasedAt: new Date(),
      },
    });
  }
}

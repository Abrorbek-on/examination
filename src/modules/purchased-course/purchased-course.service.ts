import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreatePurchasedCourseDto, PurchaseCourseDto } from "./dto/buy-course.dto/buy-course.dto";

@Injectable()
export class PurchasedCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: number) {
    return this.prisma.purchasedCourse.findMany({ where: { userId } });
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
    return this.prisma.purchasedCourse.findMany({
      where: { courseId },
      include: { user: true },
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

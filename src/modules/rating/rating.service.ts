import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateRatingDto } from "./dto/rate.dto/rate.dto";

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) { }

  async getLatest() {
    return this.prisma.rating.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getList(courseId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });

    if (!ratings.length) {
      throw new NotFoundException(`Ushbu courseId (${courseId}) uchun reytinglar topilmadi`);
    }

    return ratings;
  }


  async getAnalytics(courseId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { courseId },
      select: { rate: true },
    });

    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = ratings.reduce((sum, r) => sum + r.rate, 0);
    const average = total / ratings.length;

    return {
      average: parseFloat(average.toFixed(2)),
      count: ratings.length
    };
  }

  async create(dto: CreateRatingDto) {
    const { userId, courseId, rate, comment } = dto;

    return this.prisma.rating.create({
      data: { userId, courseId, rate, comment },
    });
  }


  async delete(id: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating not found');

    return this.prisma.rating.delete({ where: { id } });
  }
}

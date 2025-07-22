import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateCourseCategoryDto } from "./dto/create-course-category.dto/create-course-category.dto";
import { UpdateCourseCategoryDto } from "./dto/update-course-category.dto/update-course-category.dto";
import { GetAllCourseCategoriesDto } from "./dto/all.category.dto";

@Injectable()
export class CourseCategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll(query: GetAllCourseCategoriesDto) {
  const { offset = 0, limit = 10 } = query;

  const total = await this.prisma.courseCategory.count();
  const data = await this.prisma.courseCategory.findMany({
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return {
    total,
    offset,
    limit,
    data,
  };
}



  async getById(id: number) {
    const category = await this.prisma.courseCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCourseCategoryDto) {
    const exists = await this.prisma.courseCategory.findUnique({ where: { name: dto.name } });
    if (exists) throw new BadRequestException('Category with this name already exists');

    return this.prisma.courseCategory.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(id: number, dto: UpdateCourseCategoryDto) {
    const category = await this.prisma.courseCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.courseCategory.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.courseCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.courseCategory.delete({ where: { id } });
  }
}

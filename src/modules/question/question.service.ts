import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateQuestionDto } from './dto/ask-question.dto/ask-question.dto';
import { UpdateQuestionDto } from './dto/update.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getAll(offset = 0, limit = 10) {
  return this.prisma.question.findMany({
    skip: offset,
    take: limit,
    include: {
      user: true,
      course: true,
    },
  });
}


  async getOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!question) throw new NotFoundException('Savol topilmadi');
    return question;
  }

  async create(dto: CreateQuestionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new BadRequestException('Bunday user mavjud emas');

    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new BadRequestException('Bunday course mavjud emas');

    return this.prisma.question.create({
      data: {
        text: dto.text,
        courseId: dto.courseId,
        userId: dto.userId,
      },
    });
  }

  async update(id: number, dto: UpdateQuestionDto) {
    await this.getOne(id); 
    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.getOne(id); 
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async getByUser(userId: number) {
    return this.prisma.question.findMany({
      where: { userId },
    });
  }
  async getByCourse(courseId: number) {
    return this.prisma.question.findMany({
      where: { courseId },
    });
  }

  async uploadFile(id: number, filename: string) {
    await this.getOne(id);
    return this.prisma.question.update({
      where: { id },
      data: { file: filename },
    });
  }

  async search(query: string) {
    return this.prisma.question.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }
}

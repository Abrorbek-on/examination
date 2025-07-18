import { Injectable } from '@nestjs/common';
import { HomeworkSubStatus } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any) {
    return this.prisma.homework.create({ data: body });
  }

  async getAll() {
    return this.prisma.homework.findMany();
  }

  async getById(id: number) {
    return this.prisma.homework.findUnique({ where: { id } });
  }

  async getByCourse(courseId: number) {
    return this.prisma.homework.findMany({
      where: {
        lesson: {
          group: {
            courseId,
          },
        },
      },
      include: {
        lesson: true,
      },
    });
  }

  async getByLesson(lessonId: number) {
    return this.prisma.homework.findFirst({
      where: { lessonId },
    });
  }

  async getMySubmission(userId: number, lessonId: number) {
    return this.prisma.homeworkSubmission.findFirst({
      where: {
        userId,
        homework: {
          lessonId,
        },
      },
    });
  }

  async submit(lessonId: number, body: any) {
    const homework = await this.prisma.homework.findFirst({
      where: { lessonId },
    });

    if (!homework) throw new Error('Homework topilmadi');

    return this.prisma.homeworkSubmission.create({
      data: {
        homeworkId: homework.id,
        ...body,
      },
    });
  }

  async check(body: {
    submissionId: number;
    status: HomeworkSubStatus;
    reason?: string;
  }) {
    return this.prisma.homeworkSubmission.update({
      where: { id: body.submissionId },
      data: {
        status: body.status,
        reason: body.reason,
      },
    });
  }

  async update(id: number, body: any) {
    return this.prisma.homework.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: number) {
    return this.prisma.homework.delete({
      where: { id },
    });
  }
}

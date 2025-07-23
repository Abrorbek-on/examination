import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HomeworkSubStatus } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) { }

  async create(body: any) {
    const { lessonId } = body;

    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      throw new BadRequestException('lessonId notogri yoki mavjud emas');
    }

    const existingHomework = await this.prisma.homework.findUnique({
      where: { lessonId }
    });
    if (existingHomework) {
      throw new BadRequestException('Ushbu lessonId uchun homework allaqachon mavjud');
    }

    return this.prisma.homework.create({ data: body });
  }



  async getAll(offset: number, limit: number) {
    return this.prisma.homework.findMany({
      skip: offset,
      take: limit,
    });
  }


  async getById(id: number) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) {
      throw new NotFoundException(`Homework with id ${id} not found`);
    }
    return homework;
  }


  async getByCourse(courseId: number) {
    const homeworks = await this.prisma.homework.findMany({
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

    if (!homeworks.length) {
      throw new NotFoundException(`Kursga tegishli uyga vazifalar topilmadi (courseId: ${courseId})`);
    }

    return homeworks;
  }


  async getByLesson(lessonId: number) {
    const homeworks = await this.prisma.homework.findMany({
      where: { lessonId },
    });

    if (!homeworks || homeworks.length === 0) {
      throw new NotFoundException('Ushbu dars uchun vazifalar topilmadi');
    }

    return homeworks;
  }


  async getMySubmission(userId: number, lessonId: number) {
    const submission = await this.prisma.homeworkSubmission.findFirst({
      where: {
        userId,
        homework: {
          lessonId,
        },
      },
      include: {
        homework: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Bu foydalanuvchi ushbu dars uchun topshiriq yubormagan');
    }

    return submission;
  }


  async submit(lessonId: number, body: any) {
    const homework = await this.prisma.homework.findFirst({
      where: { lessonId },
    });

    if (!homework) {
      throw new BadRequestException('Berilgan lessonId boyicha hech qanday homework topilmadi');
    }

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
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id: body.submissionId },
    });

    if (!submission) {
      throw new BadRequestException('Bunday ID bilan homework submission topilmadi');
    }

    return this.prisma.homeworkSubmission.update({
      where: { id: body.submissionId },
      data: {
        status: body.status,
        reason: body.reason,
      },
    });
  }

  async update(id: number, body: any) {
    const existing = await this.prisma.homework.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Homework with id ${id} not found`);
    }

    if (body.lessonId) {
      const lesson = await this.prisma.lesson.findUnique({ where: { id: body.lessonId } });
      if (!lesson) {
        throw new BadRequestException('lessonId notogri yoki mavjud emas');
      }
    }

    return this.prisma.homework.update({
      where: { id },
      data: body,
    });
  }


  async delete(id: number) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });

    if (!homework) {
      throw new BadRequestException('Bunday ID bilan uyga vazifa topilmadi');
    }

    return this.prisma.homework.delete({ where: { id } });
  }

}

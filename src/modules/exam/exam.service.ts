import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto/create-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByLessonGroup(lessonGroupId: number) {
    return this.prisma.exam.findMany({
      where: { lessonGroupId },
    });
  }

  async passExam(data: { lessonGroupId: number; answers: { examId: number; selected: string }[] }, userId: number) {
    const exams = await this.prisma.exam.findMany({
      where: { lessonGroupId: data.lessonGroupId },
    });

    let corrects = 0;
    let wrongs = 0;

    for (const answer of data.answers) {
      const exam = exams.find((e) => e.id === answer.examId);
      if (!exam) continue;

      if (exam.answer === answer.selected) {
        corrects+=1;
      } else {
        wrongs+=1;
      }
    }

    const total = await this.prisma.exam.count();
    const passed = corrects >= Math.ceil(total * 0.7);

    await this.prisma.examResult.create({
      data: {
        lessonGroupId: data.lessonGroupId,
        userId,
        corrects,
        wrongs,
        passed,
      },
    });

    return {
      message: 'Exam checked successfully',
      passed,
      corrects,
      wrongs,
      total,
    };
  }

  async getGroupDetails(id: number) {
    return this.prisma.lessonGroup.findUnique({
      where: { id },
      include: { exams: true },
    });
  }

  async getExam(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: dto,
    });
  }

  async createMany(exams: CreateExamDto[]) {
    return this.prisma.exam.createMany({
      data: exams,
    });
  }

  async update(id: number, dto: CreateExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async getAllResults() {
    return this.prisma.examResult.findMany();
  }

  async getResultsByGroup(groupId: number) {
    return this.prisma.examResult.findMany({
      where: { lessonGroupId: groupId },
    });
  }
}

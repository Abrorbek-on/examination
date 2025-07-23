import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto/create-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) { }

  async getByLessonGroup(lessonGroupId: number) {
    const exams = await this.prisma.exam.findMany({
      where: { lessonGroupId },
    });

    if (!exams.length) {
      throw new NotFoundException('Ushbu lessonGroupId boyicha examlar topilmadi');
    }

    return exams;
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
        corrects += 1;
      } else {
        wrongs += 1;
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
    const group = await this.prisma.lessonGroup.findUnique({
      where: { id },
      include: { exams: true },
    });

    if (!group) {
      throw new NotFoundException('Ushbu ID boyicha dars guruhi topilmadi');
    }

    return group;
  }


  async getExam(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException('Ushbu ID boyicha exam topilmadi');
    }

    return exam;
  }


  async create(dto: CreateExamDto) {
    const group = await this.prisma.lessonGroup.findUnique({
      where: { id: dto.lessonGroupId },
    });

    if (!group) {
      throw new BadRequestException('Bunday lessonGroup mavjud emas');
    }

    return this.prisma.exam.create({
      data: dto,
    });
  }


  async createMany(exams: CreateExamDto[]) {
    for (let i = 0; i < exams.length; i++) {
      const group = await this.prisma.lessonGroup.findUnique({
        where: { id: exams[i].lessonGroupId },
      });

      if (!group) {
        throw new BadRequestException(
          `lessonGroupId = ${exams[i].lessonGroupId} mavjud emas`
        );
      }
    }

    return this.prisma.exam.createMany({
      data: exams,
    });
  }


  async update(id: number, dto: CreateExamDto) {
    const existingExam = await this.prisma.exam.findUnique({ where: { id } });

    if (!existingExam) {
      throw new BadRequestException(`Exam topilmadi: id = ${id}`);
    }

    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: dto.lessonGroupId },
    });

    if (!lessonGroup) {
      throw new BadRequestException(
        `Bunday lessonGroup mavjud emas: lessonGroupId = ${dto.lessonGroupId}`
      );
    }

    return this.prisma.exam.update({
      where: { id },
      data: dto,
    });
  }


  async delete(id: number) {
    const existing = await this.prisma.exam.findUnique({ where: { id } });

    if (!existing) {
      throw new BadRequestException(`Exam topilmadi: id = ${id}`);
    }

    return this.prisma.exam.delete({
      where: { id },
    });
  }


  async getAllResults(query: {
    offset: number;
    limit: number;
    lessonGroupId: number;
  }) {
    const { offset, limit, lessonGroupId } = query;

    return this.prisma.examResult.findMany({
      where: {
        lessonGroupId: Number(lessonGroupId),
      },
      skip: offset,
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        user: true,
      },
    });
  }



  async getResultsByGroup(groupId: number) {
    return this.prisma.examResult.findMany({
      where: {
        lessonGroupId: groupId,
      },
      include: {
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

}

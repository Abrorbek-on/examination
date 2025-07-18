import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto/create-lesson.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateLessonDto } from './dto/update-lesson.dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: body,
    });
  }

  async getOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        lessonFiles: true,
        lessonViews: true,
        homework: true,
      },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async view(lessonId: number) {
  return this.prisma.lessonView.create({
    data: {
      lessonId,
      userId: 1,
      view: true, 
    },
  });
}


  async update(id: number, body: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.lesson.update({
      where: { id },
      data: body,
    });
  }

  async remove(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.lesson.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/core/database/prisma.service"
import { CreateLessonFileDto } from "./dto/upload-file.dto/upload-file.dto"

@Injectable()
export class LessonFilesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateLessonFileDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lessonFile.create({
      data: dto,
      include: {
        lesson: {
          select: { id: true, name: true },
        },
      },
    });
  }



  async findByLesson(lessonId: number) {
    const files = await this.prisma.lessonFile.findMany({
      where: { lessonId },
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!files.length) {
      throw new NotFoundException(`Ushbu ID bilan dars fayllari topilmadi: ${lessonId}`);
    }

    return files;
  }


  async findOne(id: number) {
    const lessonFile = await this.prisma.lessonFile.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    })

    if (!lessonFile) throw new NotFoundException("Lesson file not found")
    return lessonFile
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.lessonFile.delete({ where: { id } })
  }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/core/database/prisma.service"
import { CreateLessonDto } from "./dto/create-lesson.dto/create-lesson.dto"
import { UpdateLessonDto } from "./dto/update-lesson.dto/update-lesson.dto"

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateLessonDto, video: Express.Multer.File) {
    const group = await this.prisma.lessonGroup.findUnique({
      where: { id: dto.groupId },
    });

    if (!group) {
      throw new BadRequestException('Bunday groupId mavjud emas');
    }

    const videoPath = `/uploads/videos/${video.filename}`;

    return this.prisma.lesson.create({
      data: {
        ...dto,
        video: videoPath,
      },
      include: {
        group: true,
      },
    });
  }


  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            course: true,
          },
        },
        lessonFiles: true,
        homework: true,
      },
    })

    if (!lesson) throw new NotFoundException("Lesson not found")
    return lesson
  }

  async findOneWithDetails(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            course: {
              include: {
                mentor: {
                  select: {
                    id: true,
                    fullName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        lessonFiles: true,
        lessonViews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
        homework: {
          include: {
            submissions: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!lesson) throw new NotFoundException("Lesson not found")
    return lesson
  }

  async markAsViewed(lessonId: number, userId: number) {
    const existingView = await this.prisma.lessonView.findFirst({
      where: {
        lessonId,
        userId,
      },
    })

    if (existingView) {
      return this.prisma.lessonView.update({
        where: { id: existingView.id },
        data: { view: true },
      })
    } else {
      return this.prisma.lessonView.create({
        data: {
          lessonId,
          userId,
          view: true,
        },
      })
    }
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id)
    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: {
        group: true,
      },
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.homework.deleteMany({
      where: { lessonId: id },
    });

    return this.prisma.lesson.delete({
      where: { id },
    });
  }

}

import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/core/database/prisma.service"
import { CreateLessonGroupDto } from "./dto/create-lesson-group.dto/create-lesson-group.dto"
import { UpdateLessonGroupDto } from "./dto/update-lesson-group.dto/update-lesson-group.dto"

@Injectable()
export class LessonGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonGroupDto: CreateLessonGroupDto) {
    return this.prisma.lessonGroup.create({
      data: createLessonGroupDto,
      include: {
        course: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    })
  }

  async findAll(courseId: number) {
    return this.prisma.lessonGroup.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  }

  async findOne(id: number) {
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id },
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
        lessons: {
          include: {
            lessonFiles: true,
            homework: true,
            _count: {
              select: {
                lessonViews: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        exams: true,
      },
    })

    if (!lessonGroup) throw new NotFoundException("Lesson group not found")
    return lessonGroup
  }

  async update(id: number, updateLessonGroupDto: UpdateLessonGroupDto) {
    await this.findOne(id)
    return this.prisma.lessonGroup.update({
      where: { id },
      data: updateLessonGroupDto,
      include: {
        course: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.lessonGroup.delete({ where: { id } })
  }
}

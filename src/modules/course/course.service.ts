import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';


@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  getAllPublished() {
    return this.prisma.course.findMany({ where: { published: true } });
  }

  getSingle(id: number) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  getFull(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        mentor: true,
        lessonGroup: { include: { lessons: true } },
        rating: true,
      },
    });
  }

  getAllAdmin() {
    return this.prisma.course.findMany();
  }

  getMyCourses(mentorId: number) {
    return this.prisma.course.findMany({ where: { mentorId } });
  }

  getMentorCourses(mentorId: number) {
    return this.getMyCourses(mentorId);
  }

  getAssignedCourses(userId: number) {
    return this.prisma.assignedCourse.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  getAssistants(courseId: number) {
    return this.prisma.assignedCourse.findMany({
      where: { courseId },
      include: { user: true },
    });
  }

  assignAssistant(courseId: number, userId: number) {
    return this.prisma.assignedCourse.create({ data: { courseId, userId } });
  }

  unassignAssistant(courseId: number, userId: number) {
    return this.prisma.assignedCourse.deleteMany({
      where: { courseId, userId },
    });
  }

  create(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  update(id: number, dto: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  publish(id: number) {
    return this.prisma.course.update({ where: { id }, data: { published: true } });
  }

  unpublish(id: number) {
    return this.prisma.course.update({ where: { id }, data: { published: false } });
  }

  updateMentor(courseId: number, mentorId: number) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { mentorId },
    });
  }

  delete(id: number) {
    return this.prisma.course.delete({ where: { id } });
  }
}
import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { CourseCategoryModule } from './modules/course-category/course-category.module';
import { CourseModule } from './modules/course/course.module';
import { AssignedCourseModule } from './modules/assigned-course/assigned-course.module';
import { PurchasedCourseModule } from './modules/purchased-course/purchased-course.module';
import { RatingModule } from './modules/rating/rating.module';
import { LessonGroupModule } from './modules/lesson-group/lesson-group.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { LessonViewModule } from './modules/lesson-view/lesson-view.module';
import { LessonFileModule } from './modules/lesson-file/lesson-file.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { HomeworkSubmissionModule } from './modules/homework-submission/homework-submission.module';
import { ExamModule } from './modules/exam/exam.module';
import { ExamResultModule } from './modules/exam-result/exam-result.module';
import { QuestionModule } from './modules/question/question.module';
import { QuestionAnswerModule } from './modules/question-answer/question-answer.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, MentorProfileModule, CourseCategoryModule, CourseModule, AssignedCourseModule, PurchasedCourseModule, RatingModule, LessonGroupModule, LessonModule, LessonViewModule, LessonFileModule, HomeworkModule, HomeworkSubmissionModule, ExamModule, ExamResultModule, QuestionModule, QuestionAnswerModule, LastActivityModule, VerificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

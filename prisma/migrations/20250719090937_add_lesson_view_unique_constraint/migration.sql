/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `AssignedCourse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId,userId]` on the table `LessonView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssignedCourse_userId_courseId_key" ON "AssignedCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonView_lessonId_userId_key" ON "LessonView"("lessonId", "userId");

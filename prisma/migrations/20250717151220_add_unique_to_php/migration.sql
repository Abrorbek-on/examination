/*
  Warnings:

  - Made the column `introVideo` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "introVideo" SET NOT NULL;

-- AlterTable
ALTER TABLE "HomeworkSubmission" ALTER COLUMN "file" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MentorProfile" ALTER COLUMN "telegram" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "linkedin" DROP NOT NULL,
ALTER COLUMN "facebook" DROP NOT NULL,
ALTER COLUMN "github" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET NOT NULL;

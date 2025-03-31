-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "topCompanies" TEXT[],
ADD COLUMN     "totalStudents" INTEGER;

// scripts/exportSeed.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data: Record<string, unknown> = {};

  data.User = await prisma.user.findMany();
  data.InstructorProfile = await prisma.instructorProfile.findMany();
  data.StudentProfile = await prisma.studentProfile.findMany();
  data.Course = await prisma.course.findMany();
  data.Category = await prisma.category.findMany();
  data.Module = await prisma.module.findMany();
  data.Lesson = await prisma.lesson.findMany();
  data.Resource = await prisma.resource.findMany();
  data.Quiz = await prisma.quiz.findMany();
  data.Question = await prisma.question.findMany();
  data.QuizAttempt = await prisma.quizAttempt.findMany();
  data.Answer = await prisma.answer.findMany();
  data.Enrollment = await prisma.enrollment.findMany();
  data.Progress = await prisma.progress.findMany();
  data.Note = await prisma.note.findMany();
  data.Certificate = await prisma.certificate.findMany();
  data.Review = await prisma.review.findMany();
  data.Cart = await prisma.cart.findMany();
  data.Wishlist = await prisma.wishlist.findMany();
  data.Order = await prisma.order.findMany();
  data.OrderItem = await prisma.orderItem.findMany();
  data.Coupon = await prisma.coupon.findMany();
  data.Announcement = await prisma.announcement.findMany();
  data.Message = await prisma.message.findMany();
  data.Notification = await prisma.notification.findMany();

  fs.writeFileSync("prisma/seed-data.json", JSON.stringify(data, null, 2));
}

main().finally(() => prisma.$disconnect());

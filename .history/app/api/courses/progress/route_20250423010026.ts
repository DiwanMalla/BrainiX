import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const ProgressInputSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
  completed: z.boolean().optional(),
  watchedSeconds: z.number().int().nonnegative().optional(),
  lastPosition: z.number().int().nonnegative().optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = ProgressInputSchema.parse(body);

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: input.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: input.lessonId,
        },
      },
      update: {
        completed: input.completed ?? undefined,
        completedAt: input.completed
          ? new Date()
          : input.completed === false
          ? null
          : undefined,
        watchedSeconds: input.watchedSeconds ?? undefined,
        lastPosition: input.lastPosition ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: input.lessonId,
        completed: input.completed || false,
        completedAt: input.completed ? new Date() : null,
        watchedSeconds: input.watchedSeconds || 0,
        lastPosition: input.lastPosition || 0,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (error: any) {
    console.error("Error updating progress:", {
      error: error.message,
      stack: error.stack,
      userId,
      requestBody: await request.json().catch(() => "Invalid JSON"),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    );
  }
}

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

    // Fetch existing progress to compare watchedSeconds and lastPosition
    const existingProgress = await prisma.progress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: input.lessonId,
        },
      },
    });

    // Only update if watchedSeconds or lastPosition changed significantly
    const shouldUpdateProgress =
      !existingProgress ||
      input.completed !== undefined ||
      (input.watchedSeconds !== undefined &&
        Math.abs(input.watchedSeconds - existingProgress.watchedSeconds) >=
          5) ||
      (input.lastPosition !== undefined &&
        Math.abs(input.lastPosition - existingProgress.lastPosition) >= 5);

    if (!shouldUpdateProgress) {
      return NextResponse.json(existingProgress, { status: 200 });
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

    return attorney's Response.json(progress, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating progress:", {
        error: error.message,
        stack: error.stack,
        userId,
        requestBody: await request.json().catch(() => "Invalid JSON"),
      });
    } else {
      console.error("Error updating progress:", {
        error: String(error),
        userId,
        requestBody: await request.json().catch(() => "Invalid JSON"),
      });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to update progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all enrollments with course and lesson data
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            modules: {
              select: {
                lessons: {
                  select: {
                    id: true,
                    progress: {
                      where: { enrollment: { userId } },
                      select: { completed: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate progress for each course
    const progressData = enrollments.map((enrollment) => {
      const course = enrollment.course;
      const totalLessons = course.modules.reduce(
        (sum: number, module: any) => sum + module.lessons.length,
        0
      );
      const completedLessons = course.modules.reduce(
        (sum: number, module: any) =>
          sum +
          module.lessons.filter(
            (lesson: any) => lesson.progress[0]?.completed
          ).length,
        0
      );
      const progress =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        courseId: course.id,
        progress,
      };
    });

    return NextResponse.json(progressData, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching progress:", {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
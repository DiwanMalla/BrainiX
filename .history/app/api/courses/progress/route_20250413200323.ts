import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      courseId,
      lessonId,
      completed,
      watchedSeconds,
      lastPosition,
      notes,
    } = await request.json();

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "Missing courseId or lessonId" },
        { status: 400 }
      );
    }

    // Find enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        completed: completed ?? undefined,
        completedAt: completed ? new Date() : undefined,
        watchedSeconds: watchedSeconds ?? undefined,
        lastPosition: lastPosition ?? undefined,
        notes: notes ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        watchedSeconds: watchedSeconds || 0,
        lastPosition: lastPosition || 0,
        notes: notes || null,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (error: any) {
    console.error("Error updating progress:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = await auth();
  console.log("Auth Details:", { userId, slug: params.slug });

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        instructor: { select: { name: true } },
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                content: true,
                type: true,
                videoUrl: true,
                duration: true,
                isPreview: true,
                progress: {
                  where: { enrollment: { userId } },
                  select: {
                    completed: true,
                    watchedSeconds: true,
                    lastPosition: true,
                    notes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      console.log("Course not found for slug:", params.slug);
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    if (
      !enrollment &&
      !course.modules.some((m) => m.lessons.some((l) => l.isPreview))
    ) {
      console.log("User not enrolled:", { userId, courseId: course.id });
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Normalize lesson progress
    const normalizedCourse = {
      ...course,
      thumbnail: course.thumbnail || null,
      modules: course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          videoUrl: lesson.videoUrl || null,
          content: lesson.content || null,
          description: lesson.description || null,
          isPreview: lesson.isPreview || false,
          progress: lesson.progress[0] || {
            completed: false,
            watchedSeconds: 0,
            lastPosition: 0,
            notes: null,
          },
        })),
      })),
    };

    console.log("Fetched course:", {
      id: normalizedCourse.id,
      title: normalizedCourse.title,
      moduleCount: normalizedCourse.modules.length,
      lessonCount: normalizedCourse.modules.reduce(
        (sum, m) => sum + m.lessons.length,
        0
      ),
    });

    return NextResponse.json(normalizedCourse, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching course:", {
      error: error.message,
      stack: error.stack,
      slug: params.slug,
      userId,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

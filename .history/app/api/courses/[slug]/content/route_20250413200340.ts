import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                progress: {
                  where: {
                    enrollment: {
                      user: { clerkId: userId },
                      course: { slug },
                    },
                  },
                },
              },
            },
          },
        },
        enrollments: {
          where: { user: { clerkId: userId } },
          select: { id: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.enrollments.length) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    const courseContent = {
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      modules: course.modules.map((module) => ({
        id: module.id,
        title: module.title,
        lessons: module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          progress: lesson.progress[0] || {
            completed: false,
            watchedSeconds: 0,
            lastPosition: 0,
            notes: null,
          },
        })),
      })),
    };

    return NextResponse.json(courseContent, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching course content:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to fetch course content", details: error.message },
      { status: 500 }
    );
  }
}

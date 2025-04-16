import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const params = useParams();
  const { userId } = await auth();
  console.log("Auth Details:", { userId, slug: params.slug }); // Debug log

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
              include: {
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

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Normalize lesson progress
    const normalizedCourse = {
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          progress: lesson.progress[0] || {
            completed: false,
            watchedSeconds: 0,
            lastPosition: 0,
            notes: null,
          },
        })),
      })),
    };

    return NextResponse.json(normalizedCourse, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching course:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

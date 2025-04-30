import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const slug = request.nextUrl.pathname.split("/").pop(); // Extract slug from URL path

  console.log("Auth Details:", { userId, slug });

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
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
                  where: {
                    enrollment: {
                      userId,
                    },
                  },
                  select: {
                    id: true,
                    completed: true,
                    watchedSeconds: true,
                    lastPosition: true,
                    completedAt: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
                notes: {
                  where: {
                    enrollment: {
                      userId,
                    },
                  },
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
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

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: course.id,
        status: "ACTIVE",
      },
    });

    if (
      !enrollment &&
      !course.modules.some((module) =>
        module.lessons.some((lesson) => lesson.isPreview)
      )
    ) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    return NextResponse.json({
      ...course,
      isEnrolled: !!enrollment,
      enrollmentId: enrollment?.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching course:", {
        error: error.message,
        stack: error.stack,
        slug,
        userId,
      });
    } else {
      console.error("Error fetching course:", { error, slug, userId });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// app/api/courses/[slug]/content/route.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  const { slug } = await params; // Await params to access slug
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
                  // Query Note model
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
    console.error("Error fetching course:", {
      error: error.message,
      stack: error.stack,
      slug,
      userId,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

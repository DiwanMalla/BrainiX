import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all enrollments for the user, including course, modules, and lessons
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            image: true,
            instructor: true,
            price: true,
            modules: {
              select: {
                id: true,
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    progress: {
                      where: { enrollment: { userId } },
                      select: {
                        completed: true,
                        completedAt: true,
                        watchedSeconds: true,
                        lastPosition: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Map enrollments to the PurchasedCourse interface
    const purchasedCourses = enrollments.map((enrollment) => {
      const course = enrollment.course;

      // Calculate total and completed lessons
      const totalLessons = course.modules.reduce(
        (sum: number, module: any) => sum + module.lessons.length,
        0
      );
      const completedLessons = course.modules.reduce(
        (sum: number, module: any) =>
          sum +
          module.lessons.filter((lesson: any) => lesson.progress[0]?.completed)
            .length,
        0
      );
      const progress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        image: course.image,
        instructor: course.instructor,
        price: course.price,
        purchaseDate: enrollment.createdAt.toISOString(),
        progress,
      };
    });

    return NextResponse.json(purchasedCourses, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching purchased courses:", {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch purchased courses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

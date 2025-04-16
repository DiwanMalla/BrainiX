import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { user: { clerkId: userId } },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            price: true,
            discountPrice: true,
            instructor: { select: { name: true } },
          },
        },
        progress: {
          include: {
            lesson: {
              select: { id: true, duration: true },
            },
          },
        },
      },
    });

    const purchasedCourses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.progress.length;
      const completedLessons = enrollment.progress.filter(
        (p) => p.completed
      ).length;
      const progress =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        id: enrollment.course.id,
        slug: enrollment.course.slug,
        title: enrollment.course.title,
        image: enrollment.course.thumbnail,
        instructor: enrollment.course.instructor.name,
        price: enrollment.course.discountPrice || enrollment.course.price,
        purchaseDate: enrollment.enrolledAt.toISOString(),
        progress: Math.round(progress),
      };
    });

    return NextResponse.json(purchasedCourses, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching purchased courses:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to fetch purchased courses", details: error.message },
      { status: 500 }
    );
  }
}

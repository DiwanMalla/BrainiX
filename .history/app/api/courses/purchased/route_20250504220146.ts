import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all enrollments for the user, including course details
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
          },
        },
      },
    });

    // Map enrollments to the PurchasedCourse interface (without progress)
    const purchasedCourses = enrollments.map((enrollment) => ({
      id: enrollment.course.id,
      slug: enrollment.course.slug,
      title: enrollment.course.title,
      image: enrollment.course.image,
      instructor: enrollment.course.instructor,
      price: enrollment.course.price,
      purchaseDate: enrollment.createdAt.toISOString(),
      progress: 0, // Placeholder, will be updated by /api/courses/progress
    }));

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

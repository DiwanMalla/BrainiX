import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const excludeSlug = searchParams.get("excludeSlug");

  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        slug: { not: excludeSlug || undefined },
      },
      include: {
        instructor: true,
        category: true,
      },
      take: 3,
      orderBy: { totalStudents: "desc" },
    });

    const formattedCourses = courses.map((course) => {
      const discount =
        course.discountPrice && course.price > 0
          ? Math.round(
              ((course.price - course.discountPrice) / course.price) * 100
            )
          : undefined;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || "",
        price: course.price,
        discount,
        thumbnail: course.thumbnail || "/placeholder.svg",
        instructor: course.instructor?.name || "Unknown Instructor",
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended courses" },
      { status: 500 }
    );
  }
}

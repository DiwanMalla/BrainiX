import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic'
export const revalidate = 60 // revalidate every minute

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        instructor: true,
        category: true,
      },
      take: 6,
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
        thumbnail: course.thumbnail || "/placeholder.svg",
        price: course.price,
        discount,
        rating: course.rating || 0,
        students: course.totalStudents || 0,
        bestseller: course.bestseller,
        category: { name: course.category?.name || "Uncategorized" },
        level: course.level,
        instructor: { name: course.instructor?.name || "Unknown Instructor" },
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

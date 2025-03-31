import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Import Prisma client

export async function GET() {
  try {
    // Fetch courses with necessary relationships and limited fields
    const courses = await prisma.course.findMany({
      take: 6, // Limit to 6 courses for this section
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        thumbnail: true,
        price: true,
        level: true,
        category: {
          select: {
            name: true, // Get the category name
          },
        },
        instructor: {
          select: {
            name: true, // Get the instructor's name
          },
        },
      },
    });

    return NextResponse.json(courses); // Return the fetched courses
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

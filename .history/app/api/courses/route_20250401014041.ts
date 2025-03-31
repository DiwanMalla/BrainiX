import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // assuming your Prisma client is located here

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      take: 6, // Get only the top 6 courses for display
      orderBy: {
        createdAt: "desc", // Adjust this according to how you want to order the courses
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

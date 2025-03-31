import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ Correct authentication for APIs
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: { instructorId: userId },
      include: { category: true },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courseData = await req.json();

    const course = await prisma.course.create({
      data: {
        ...courseData,
        instructorId: userId,
        publishedAt: courseData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

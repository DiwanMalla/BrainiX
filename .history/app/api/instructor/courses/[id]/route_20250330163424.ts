import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { useUser } from "@clerk/nextjs";

// GET: Fetch a single course by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user } = useUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: { category: true, modules: { include: { lessons: true } } },
    });

    if (!course || course.instructorId !== userId) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user } = useUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const courseData = await req.json();

    const updatedCourse = await prisma.course.update({
      where: { id: params.id, instructorId: userId },
      data: {
        ...courseData,
        publishedAt:
          courseData.status === "PUBLISHED" && !courseData.publishedAt
            ? new Date()
            : courseData.publishedAt,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.course.delete({
      where: { id: params.id, instructorId: userId },
    });

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ Correct authentication for APIs
import prisma from "@/lib/db";

// ✅ GET: Fetch courses with enrollments for a specific instructor
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract the instructorId from the query params
    const url = new URL(req.url);
    const instructorId = userId || url.searchParams.get("instructorId");

    if (!instructorId) {
      return NextResponse.json(
        { error: "Instructor ID is required" },
        { status: 400 }
      );
    }

    // Fetch courses and their enrollments for the instructor
    const coursesWithEnrollments = await prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: {
          include: {
            user: {
              select: { name: true, email: true }, // Only fetch necessary fields
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    // Return the courses with enrollments
    return NextResponse.json(coursesWithEnrollments);
  } catch (error) {
    console.error("Error fetching instructor courses with enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update a course by ID
export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const courseId = url.pathname.split("/").pop(); // Extract course ID from URL path

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const courseData = await req.json();

    // Update the course data in the database
    const updatedCourse = await prisma.course.update({
      where: { id: courseId, instructorId: userId },
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

// ✅ DELETE: Remove a course by ID
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const courseId = url.pathname.split("/").pop(); // Extract course ID from URL path

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Delete the course from the database
    await prisma.course.delete({
      where: { id: courseId, instructorId: userId },
    });

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

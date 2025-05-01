import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Clerk authentication
import prisma from "@/lib/db"; // Prisma client instance

// GET: Fetch instructor profile
export async function GET() {
  const { userId } = await auth();
  console.log(userId);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user)
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );

    const profile = await prisma.instructorProfile.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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

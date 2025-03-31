// /api/instructor/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all courses by the instructor
    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: userId },
      select: { id: true, title: true },
    });

    const courseIds = instructorCourses.map((course) => course.id);

    // Fetch students enrolled in these courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: { title: true },
        },
      } as const, // Ensure TypeScript understands the inclusion of the user relation
    });

    // Aggregate enrollments by student
    const studentsMap = new Map<string, Student>();
    enrollments.forEach((enrollment) => {
      const studentId = enrollment.user.id;
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: enrollment.user.id,
          name: enrollment.user.name || "Unknown",
          email: enrollment.user.email,

          enrollments: [],
        });
      }
      studentsMap.get(studentId)!.enrollments.push({
        courseTitle: enrollment.course.title,
        enrollmentDate: enrollment.createdAt.toISOString(),
        progress: 0, // Assuming progress is a field
        lastActive:
          enrollment.updatedAt.toISOString() ||
          enrollment.createdAt.toISOString(), // Fallback to createdAt if lastActive isn’t set
      });
    });

    const students = Array.from(studentsMap.values());
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching instructor students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

interface Student {
  id: string;
  name: string;
  email: string;
  country?: string;
  enrollments: {
    courseTitle: string;
    enrollmentDate: string;
    progress: number;
    lastActive: string;
  }[];
}

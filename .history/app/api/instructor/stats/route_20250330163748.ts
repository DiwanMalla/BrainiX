import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { useUser } from "@clerk/nextjs";

// GET: Fetch instructor statistics
export async function GET(req: NextRequest) {
  const { user } = useUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  try {
    const [courses, totalStudents, totalRevenue] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: userId },
        select: { id: true }, // Removed 'rating' field as it does not exist in the schema
      }),
      prisma.enrollment.count({
        where: { course: { instructorId: userId } },
      }),
      prisma.order.aggregate({
        where: {
          items: { some: { course: { instructorId: userId } } },
          status: "COMPLETED",
        },
        _sum: { total: true },
      }),
    ]);

    const stats = {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue: totalRevenue._sum.total || 0,
      // Removed averageRating calculation as 'rating' does not exist in the schema
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

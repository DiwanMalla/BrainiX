import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

// GET: Fetch instructor statistics
export async function GET(req: NextRequest) {
  const { userId } = await auth(); // ✅ Correct authentication method
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [courses, totalStudents, totalRevenue] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: userId },
        select: { id: true },
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

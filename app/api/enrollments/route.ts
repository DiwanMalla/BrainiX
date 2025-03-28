import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId, status: "ACTIVE" },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    });

    return NextResponse.json(enrollments.map((item) => item.course));
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

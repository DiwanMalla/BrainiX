import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: Fetch all instructor profiles (public access)
export async function GET() {
  try {
    // Fetch all instructor profiles with associated user data
    const instructors = await prisma.instructorProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      where: {
        featured: true, // Optionally, only show featured instructors
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(instructors, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}

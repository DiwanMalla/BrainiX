import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: {
        interests: true,
        learningGoals: true,
        education: true,
        occupation: true,
      },
    });

    return NextResponse.json(profile || {});
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { interests, learningGoals, education, occupation } =
      await request.json();

    // Validation
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: "At least one interest is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        interests,
        learningGoals: learningGoals || null,
        education: education || null,
        occupation: occupation || null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        interests,
        learningGoals: learningGoals || null,
        education: education || null,
        occupation: occupation || null,
        totalCourses: 0,
        completedCourses: 0,
        totalSpent: 0,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error saving student profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

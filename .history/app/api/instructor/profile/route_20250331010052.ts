import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Clerk authentication
import prisma from "@/lib/db"; // Prisma client instance

// GET: Fetch instructor profile
export async function GET(req: NextRequest) {
  const { userId } = auth();
  console.log(userId);
  if (!userId)
    return console.log("GET /api/instructor/profile - Clerk userId:", userId);
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

// PUT: Update instructor profile
export async function PUT(req: NextRequest) {
  const { userId } = auth();

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

    const body = await req.json();
    const { title, specialization, biography, website, socialLinks } = body;

    const updatedProfile = await prisma.instructorProfile.update({
      where: { userId: user.id },
      data: { title, specialization, biography, website, socialLinks },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

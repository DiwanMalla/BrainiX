import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { instructorId: string } }
) {
  try {
    const profile = await prisma.instructorProfile.findUnique({
      where: { userId: params.instructorId },
      include: { user: { select: { name: true, image: true, email: true } } },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...profile,
        user: {
          name: profile.user.name,
          image: profile.user.image,
          email: profile.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching instructor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

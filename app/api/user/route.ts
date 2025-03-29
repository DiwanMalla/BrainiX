// app/api/user/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server"; // Use NextResponse for App Router

export async function GET() {
  try {
    const instructor = await prisma.user.findFirst({
      where: {
        role: "INSTRUCTOR",
      },
      include: {
        courses: true,
      },
    });

    if (instructor) {
      console.log("Instructor fetched:", instructor);
      return NextResponse.json(instructor, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// app/api/check-user/route.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("No session", { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  if (user.role === "INSTRUCTOR") {
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!instructorProfile) {
      return new NextResponse("InstructorProfile not found", { status: 404 });
    }
  }

  return new NextResponse("User and InstructorProfile records ready", {
    status: 200,
  });
}

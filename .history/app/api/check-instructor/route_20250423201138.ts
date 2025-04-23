// app/api/check-instructor/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const instructorProfile = await prisma.instructorProfile.findUnique({
    where: { userId: user.id },
  });
  if (!instructorProfile) {
    return new NextResponse("InstructorProfile not found", { status: 404 });
  }

  return new NextResponse("InstructorProfile found", { status: 200 });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs = await prisma.instructorPreferences.findUnique({
    where: { instructorId: userId },
  });
  return NextResponse.json(prefs || {});
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const prefs = await prisma.instructorPreferences.upsert({
    where: { instructorId: userId },
    update: data,
    create: { instructorId: userId, ...data },
  });
  return NextResponse.json(prefs);
}

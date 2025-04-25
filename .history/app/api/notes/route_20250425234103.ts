import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  return NextResponse.json({ notes: `Mock notes for course ${courseId}` });
}

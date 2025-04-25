import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Pusher from "pusher";

const prisma = new PrismaClient();
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = params;
  const { searchParams } = new URL(request.url);
  const intake = searchParams.get("intake") || "current";

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: { user: { clerkId: userId }, courseId },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in course" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        courseId: courseId, // Explicitly match courseId
        ...(intake === "previous" && {
          createdAt: {
            lte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        }),
      },
      include: {
        sender: { select: { name: true, image: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest, // Changed from Request to NextRequest
  { params }: { params: { courseId: string } }
) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = params;
  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid message content" },
      { status: 400 }
    );
  }

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: { user: { clerkId: userId }, courseId },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in course" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim().slice(0, 1000),
        sender: { connect: { clerkId: userId } },
        courseId: courseId, // Explicitly set courseId as a scalar field
        likes: 0, // Explicitly set default value to match schema
      },
      include: {
        sender: { select: { name: true, image: true, role: true } },
      },
    });

    await pusher.trigger(`course-${courseId}`, "new-message", {
      id: message.id,
      user: message.sender.name ?? "Anonymous", // Handle null name
      avatar:
        message.sender.image ||
        (message.sender.name?.slice(0, 2).toUpperCase() ?? "AN"),
      message: message.content,
      time: message.createdAt.toISOString(),
      likes: message.likes, // Now included in the query
      isInstructor: message.sender.role === "INSTRUCTOR",
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

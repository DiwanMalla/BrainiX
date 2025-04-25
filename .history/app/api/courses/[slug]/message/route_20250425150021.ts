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
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = getAuth(request as NextRequest);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params; // Simplified params access
  const { searchParams } = new URL(request.url);
  const intake = searchParams.get("intake") || "current";

  try {
    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        user: { clerkId: userId },
        course: { slug },
      },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in course" },
        { status: 403 }
      );
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: {
        courseSlug: slug, // Use courseSlug directly since it's indexed
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
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = getAuth(request as NextRequest);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;
  const { content } = await request.json();
  console.log("Received content:", content);
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid message content" },
      { status: 400 }
    );
  }

  try {
    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        user: { clerkId: userId },
        course: { slug },
      },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in course" },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim().slice(0, 1000),
        sender: { connect: { clerkId: userId } },
        course: { connect: { slug } }, // Connect to Course relation
      },
      include: {
        sender: { select: { name: true, image: true, role: true } },
      },
    });

    // Trigger Pusher event
    await pusher.trigger(`course-${slug}`, "new-message", {
      id: message.id,
      user: message.sender.name,
      avatar:
        message.sender.image ||
        (message.sender.name ?? "??").slice(0, 2).toUpperCase(),
      message: message.content,
      time: message.createdAt.toISOString(),
      likes: message.likes,
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

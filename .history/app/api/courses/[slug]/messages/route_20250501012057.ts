import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/db"; // Reuse singleton Prisma client
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { [key: string]: string | string[] } }
) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = params.slug as string; // Assert slug as string
  const { searchParams } = new URL(request.url);
  const intake = searchParams.get("intake") || "current";

  try {
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

    const messages = await prisma.message.findMany({
      where: {
        courseSlug: slug,
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
  request: NextRequest,
  { params }: { params: { [key: string]: string | string[] } }
) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = params.slug as string; // Assert slug as string
  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid message content" },
      { status: 400 }
    );
  }

  try {
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

    const message = await prisma.message.create({
      data: {
        content: content.trim().slice(0, 1000),
        sender: { connect: { clerkId: userId } },
        course: { connect: { slug } },
        courseSlug: slug, // Ensure courseSlug is set
      },
      include: {
        sender: { select: { name: true, image: true, role: true } },
      },
    });

    await pusher.trigger(`course-${slug}`, "new-message", {
      id: message.id,
      user: message.senderId.name ?? "Anonymous",
      avatar:
        message.senderId.image ||
        (message.senderId.name?.slice(0, 2).toUpperCase() ?? "NA"),
      message: message.content,
      time: message.createdAt.toISOString(),
      likes: message.likes ?? 0, // Fallback for null likes
      isInstructor: message.senderId.role === "INSTRUCTOR",
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

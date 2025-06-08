import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cuid } from "@paralleldrive/cuid2";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, commentId } = await params;

  try {
    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Reply content is required" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog || blog.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const parentComment = await prisma.blogComment.findUnique({
      where: { id: commentId },
    });
    if (!parentComment || parentComment.blogId !== id) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const reply = await prisma.blogComment.create({
      data: {
        id: cuid(),
        content: content.trim(),
        blogId: id,
        userId,
        parentId: commentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: { select: { name: true, image: true } },
        replies: {
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

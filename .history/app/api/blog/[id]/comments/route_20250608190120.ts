import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import cuid from "cuid";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
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

    const comment = await prisma.blogComment.create({
      data: {
        id: cuid(),
        content: content.trim(),
        blogId: id,
        userId,
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

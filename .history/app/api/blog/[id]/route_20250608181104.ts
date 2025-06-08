import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const post = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, image: true } },
        comments: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        likes: true,
      },
    });

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { userId } = await auth();
    const isAuthor = userId ? userId === post.authorId : false;

    return NextResponse.json({ post, isAuthor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await prisma.blog.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content, summary, thumbnail, tags } = await request.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingPost = await prisma.blog.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    await prisma.blog.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        slug,
        summary: summary?.trim() || null,
        thumbnail: thumbnail?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
      },
    });

    return NextResponse.json({ message: "Post updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await prisma.blog.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjusted to your lib/prisma.ts
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const posts = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true, image: true } },
        comments: { select: { id: true } },
        likes: { select: { id: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    // Check for slug uniqueness
    const existingPost = await prisma.blog.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blog.create({
      data: {
        id: cuid(),
        title: title.trim(),
        content: content.trim(),
        slug,
        summary: summary?.trim() || null,
        thumbnail: thumbnail?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
        status: "PUBLISHED",
        authorId: userId,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ id: post.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

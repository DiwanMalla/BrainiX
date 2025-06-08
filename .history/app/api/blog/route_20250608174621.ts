import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

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
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const id = `post-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await prisma.blog.create({
      data: {
        id,
        title,
        content,
        slug,
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

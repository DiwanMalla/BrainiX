import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjusted to your lib/prisma.ts
import { auth } from "@clerk/nextjs/server";
import cuid from "cuid";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "recent";

    let orderBy: any = { publishedAt: "desc" };
    
    switch (filter) {
      case "popular":
        orderBy = { views: { _count: "desc" } };
        break;
      case "trending":
        orderBy = { likes: { _count: "desc" } };
        break;
      case "discussed":
        orderBy = { comments: { _count: "desc" } };
        break;
      default:
        orderBy = { publishedAt: "desc" };
    }

    const posts = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true, image: true } },
        comments: { select: { id: true } },
        likes: { select: { id: true } },
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true,
          },
        },
      },
      orderBy,
      take: 12,
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
        excerpt: summary?.trim() || null,
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

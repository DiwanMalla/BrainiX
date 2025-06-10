import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const filter = searchParams.get("filter") || "recent"; // recent, popular, trending

    if (!query) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true,
          },
        },
      },
      orderBy:
        filter === "popular"
          ? { views: { _count: "desc" } }
          : filter === "trending"
          ? { likes: { _count: "desc" } }
          : { updatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[BLOG_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

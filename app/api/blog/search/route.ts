import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const filter = searchParams.get("filter") || "recent";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    let orderBy: any = { updatedAt: "desc" };
    if (filter === "popular") orderBy = { totalViews: "desc" };
    if (filter === "trending") orderBy = { likes: { _count: "desc" } };
    if (filter === "discussed") orderBy = { comments: { _count: "desc" } };

    const posts = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy,
      take: 20,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG_SEARCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

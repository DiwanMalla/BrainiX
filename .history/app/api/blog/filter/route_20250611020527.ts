import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "recent";

    const blogs = await prisma.blog.findMany({
      where: {
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
        comments: true,
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: [
        ...(filter === "popular"
          ? [{ totalViews: "desc" }]
          : filter === "trending"
          ? [{ likes: { _count: "desc" } }]
          : filter === "discussed"
          ? [{ comments: { _count: "desc" } }]
          : [{ updatedAt: "desc" }]),
      ],
      take: 20,
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("[BLOG_FILTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
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
        _count: {
          select: {
            likes: true,
            views: true,
          },
        },
      },
      orderBy: [
        {
          views: {
            _count: "desc",
          },
        },
        {
          likes: {
            _count: "desc",
          },
        },
        {
          comments: {
            _count: "desc",
          },
        },
      ],
      take: 9, // Get top 9 trending posts
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG_TRENDING]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

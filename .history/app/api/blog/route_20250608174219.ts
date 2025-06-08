import { NextResponse } from "next/server";
import prisma from "@/lib/db";

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

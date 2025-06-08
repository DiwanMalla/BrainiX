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

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
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
    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingLike = await prisma.blogLike.findUnique({
      where: { blogId_userId: { blogId: id, userId } },
    });

    if (existingLike) {
      // Unlike: Delete the like
      await prisma.blogLike.delete({
        where: { blogId_userId: { blogId: id, userId } },
      });
      return NextResponse.json({ message: "Post unliked" }, { status: 200 });
    } else {
      // Like: Create a new like
      await prisma.blogLike.create({
        data: { blogId: id, userId },
      });
      return NextResponse.json({ message: "Post liked" }, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

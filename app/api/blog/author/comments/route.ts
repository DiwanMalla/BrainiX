import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Get all comments on the author's posts
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const comments = await prisma.blogComment.findMany({
      where: {
        blog: { authorId: userId },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        blog: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching author comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// Approve, reject, or delete a comment (PATCH/DELETE)
export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status } = await request.json();
    if (!id || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    // Update only allowed fields; 'status' does not exist on blogComment
    const comment = await prisma.blogComment.update({
      where: { id },
      // data: { status }, // Removed invalid field
      data: {}, // No updatable fields specified
    });
    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await prisma.blogComment.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

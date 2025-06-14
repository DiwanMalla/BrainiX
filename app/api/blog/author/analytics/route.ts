import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [totalPosts, totalViews, totalComments, totalDrafts] =
      await Promise.all([
        prisma.blog.count({ where: { authorId: userId } }),
        prisma.blog.aggregate({
          where: { authorId: userId },
          _sum: { totalViews: true },
        }),
        prisma.blogComment.count({ where: { userId } }),
        prisma.blog.count({ where: { authorId: userId, status: "DRAFT" } }),
      ]);
    return NextResponse.json({
      totalPosts,
      totalViews: totalViews._sum.totalViews || 0,
      totalComments,
      totalDrafts,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

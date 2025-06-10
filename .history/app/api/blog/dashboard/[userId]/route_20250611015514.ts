import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Get user's posts and their stats
    const [posts, stats] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: userId,
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
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              followers: true,
              posts: {
                where: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      }),
    ]);

    // Calculate total stats
    const totalViews = posts.reduce(
      (acc, post) => acc + (post._count?.views || 0),
      0
    );
    const totalLikes = posts.reduce(
      (acc, post) => acc + (post._count?.likes || 0),
      0
    );
    const totalComments = posts.reduce(
      (acc, post) => acc + (post._count?.comments || 0),
      0
    );

    // Get recent posts (last 5)
    const recentPosts = posts.slice(0, 5);

    // Get popular posts (top 5 by views)
    const popularPosts = [...posts]
      .sort((a, b) => (b._count?.views || 0) - (a._count?.views || 0))
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalPosts: stats?._count?.posts || 0,
        totalViews: totalViews,
        totalLikes: totalLikes,
        totalComments: totalComments,
        totalFollowers: stats?._count?.followers || 0,
      },
      recentPosts,
      popularPosts,
    });
  } catch (error) {
    console.error("[BLOG_DASHBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

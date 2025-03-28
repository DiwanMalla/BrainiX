import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, slug: true, title: true, thumbnail: true },
        },
      },
    });

    // Ensure TypeScript properly infers the type
    const formattedWishlist = wishlist.map(
      (item: {
        course: {
          id: string;
          slug: string;
          title: string;
          thumbnail: string | null;
        };
      }) => ({
        course: {
          id: item.course.id,
          slug: item.course.slug,
          title: item.course.title,
          thumbnail: item.course.thumbnail || "/placeholder.svg",
        },
      })
    );

    return NextResponse.json(formattedWishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

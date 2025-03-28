import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: { id: true, slug: true, title: true, thumbnail: true },
        },
      },
    });

    // Ensure TypeScript properly infers the type
    const formattedWishlist = wishlist.map(
      (item: {
        course: { id: string; slug: string; title: string; thumbnail: string };
      }) => ({
        course: {
          id: item.course.id,
          slug: item.course.slug,
          title: item.course.title,
          thumbnail: item.course.thumbnail,
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

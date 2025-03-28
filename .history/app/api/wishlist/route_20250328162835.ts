import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getAuthUser } from "@/lib/auth";

interface WishlistItem {
  course: {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
  };
}

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

    const formattedWishlist: WishlistItem[] = wishlist.map(
      (item) => item as WishlistItem
    );

    return NextResponse.json(formattedWishlist);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

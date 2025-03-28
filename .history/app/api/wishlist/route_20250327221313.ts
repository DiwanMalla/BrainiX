import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            price: true,
            instructor: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(wishlist.map((item) => item.course));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

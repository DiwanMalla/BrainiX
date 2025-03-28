import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.order.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
      include: {
        items: {
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
        },
      },
    });

    return NextResponse.json(cartItems?.items.map((item) => item.course) || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

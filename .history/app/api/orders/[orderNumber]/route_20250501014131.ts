import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type Params = Promise<{ orderNumber: string }>;
export async function GET({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
                discountPrice: true,
                instructor: { select: { name: true } },
              },
            },
          },
        },
        coupon: { select: { code: true } },
        user: { select: { id: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== userId) {
      return NextResponse.json(
        { error: "Access denied to this order" },
        { status: 403 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching order:", {
        error: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Error fetching order:", { error });
    }
    return NextResponse.json(
      {
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

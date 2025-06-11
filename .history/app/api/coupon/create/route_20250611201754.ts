import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  // Ensure only admin can create coupons
  const user = await prisma.user.findUnique({
    where: { id: userId ?? "" },
  });

  if (!userId || user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: "BRAINIX10",
        description: "10% off on all courses",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date("2026-12-31"), // Valid until end of 2026
        isActive: true,
        minOrderValue: 0, // No minimum order value
        maxDiscountAmount: 500, // Maximum discount capped at $500
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

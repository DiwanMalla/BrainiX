import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive || coupon.endDate < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired promo code" },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Promo code usage limit reached" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Promo code applied",
      discount: coupon.discountValue,
      discountType: coupon.discountType,
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return NextResponse.json(
      { error: "Failed to apply promo code" },
      { status: 500 }
    );
  }
}

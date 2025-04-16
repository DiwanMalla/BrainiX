// /api/stripe/checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Updated to the correct supported version
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { total, promoCode, billingDetails } = await request.json();
    if (total === undefined || total === null || isNaN(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount. Total must be greater than zero." },
        { status: 400 }
      );
    }

    // Fetch cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { course: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate server-side total
    let subtotal = cartItems.reduce(
      (sum, item) => sum + (item.course.discountPrice || item.course.price),
      0
    );
    let discount = 0;
    let couponId: string | undefined;

    // Validate promo code
    if (promoCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: promoCode.toLowerCase() },
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
      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        return NextResponse.json(
          { error: "Order value below minimum for this promo" },
          { status: 400 }
        );
      }

      if (coupon.discountType === "PERCENTAGE") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
      } else {
        discount = coupon.discountValue;
      }
      couponId = coupon.id;
    }

    const calculatedTotal = subtotal - discount;
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: "Total amount mismatch" },
        { status: 400 }
      );
    }

    const amount = Math.round(calculatedTotal * 100);
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than zero" },
        { status: 400 }
      );
    }

    // Create PaymentIntent for card only
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      payment_method_types: ["card"],
      metadata: {
        userId,
        courseIds: cartItems.map((item) => item.courseId).join(","),
        promoCode: promoCode || "",
        billingDetails: JSON.stringify(billingDetails || {}),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Error creating payment intent:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

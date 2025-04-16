import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { generate } from "random-words";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paymentIntentId, total, promoCode, billingDetails } =
      await request.json();

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful" },
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

    // Calculate totals
    let subtotal = cartItems.reduce(
      (sum, item) => sum + (item.course.discountPrice || item.course.price),
      0
    );
    let discount = 0;
    let couponId: string | undefined;

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

      // Update coupon usage
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const calculatedTotal = subtotal - discount;
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: "Total amount mismatch" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${generate({
      exactly: 1,
      wordsPerString: 2,
      separator: "-",
    })[0].toUpperCase()}-${Date.now().toString().slice(-4)}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: "COMPLETED",
        total: calculatedTotal,
        discount,
        tax: 0,
        currency: "AUD",
        paymentMethod: "card",
        paymentId: paymentIntentId,
        couponId,
        billingAddress: billingDetails,
        items: {
          create: cartItems.map((item) => ({
            courseId: item.courseId,
            price: item.course.discountPrice || item.course.price,
          })),
        },
      },
      include: { items: true },
    });

    // Create enrollments for each course
    for (const item of cartItems) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: item.courseId,
          },
        },
        update: {}, // No updates needed if enrollment exists
        create: {
          userId,
          courseId: item.courseId,
          enrolledAt: new Date(),
        },
      });
    }

    // Clear cart
    await prisma.cart.deleteMany({ where: { userId } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}

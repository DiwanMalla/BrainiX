import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { generate } from "random-words";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { userId, courseIds, promoCode, billingDetails } =
      paymentIntent.metadata;

    if (!userId || !courseIds) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      // Check if order already exists
      const existingOrder = await prisma.order.findFirst({
        where: { paymentId: paymentIntent.id },
      });
      if (existingOrder) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Fetch cart items (or use courseIds)
      const cartItems = await prisma.cart.findMany({
        where: { userId, courseId: { in: courseIds.split(",") } },
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
        if (coupon && coupon.isActive && coupon.endDate >= new Date()) {
          if (coupon.discountType === "PERCENTAGE") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (
              coupon.maxDiscountAmount &&
              discount > coupon.maxDiscountAmount
            ) {
              discount = coupon.maxDiscountAmount;
            }
          } else {
            discount = coupon.discountValue;
          }
          couponId = coupon.id;

          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const total = subtotal - discount;
      const amount = paymentIntent.amount / 100;
      if (Math.abs(total - amount) > 0.01) {
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
      await prisma.order.create({
        data: {
          orderNumber,
          userId,
          status: "COMPLETED",
          total,
          discount,
          tax: 0,
          currency: "AUD",
          paymentMethod: "card",
          paymentId: paymentIntent.id,
          couponId,
          billingAddress: JSON.parse(billingDetails || "{}"),
          items: {
            create: cartItems.map((item) => ({
              courseId: item.courseId,
              price: item.course.discountPrice || item.course.price,
            })),
          },
        },
      });

      // Clear cart
      await prisma.cart.deleteMany({ where: { userId } });

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
      console.error("Error processing webhook:", {
        error: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        { error: "Failed to process webhook" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

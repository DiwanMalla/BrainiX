// /api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-01",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook Error: Invalid signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, courseIds, promoCode, billingDetails } =
        paymentIntent.metadata;

      // Prevent duplicate processing
      const existingOrder = await prisma.order.findUnique({
        where: { paymentId: paymentIntent.id },
      });
      if (existingOrder) {
        return NextResponse.json({ received: true });
      }

      const courseIdArray = courseIds.split(",");
      const amount = paymentIntent.amount / 100;

      // Fetch cart items to validate
      const cartItems = await prisma.cart.findMany({
        where: { userId, courseId: { in: courseIdArray } },
        include: { course: true },
      });

      if (cartItems.length === 0) {
        console.error("No cart items found for user:", userId);
        return NextResponse.json(
          { error: "No cart items found" },
          { status: 400 }
        );
      }

      // Calculate total and discount
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
          console.error("Invalid coupon:", promoCode);
        } else {
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
        }
      }

      const total = subtotal - discount;

      // Generate order number
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `ORD-${date}-${suffix}`;

      // Transaction for order and related updates
      await prisma.$transaction(async (tx) => {
        // Update coupon
        if (couponId) {
          await tx.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
          });
        }

        // Create Order
        await tx.order.create({
          data: {
            orderNumber,
            userId,
            status: "COMPLETED",
            total,
            discount,
            currency: "AUD",
            paymentMethod: paymentIntent.payment_method_types[0],
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

        // Create Enrollments
        await Promise.all(
          courseIdArray.map((courseId) =>
            tx.enrollment.upsert({
              where: { userId_courseId: { userId, courseId } },
              create: { userId, courseId, status: "ACTIVE" },
              update: {},
            })
          )
        );

        // Clear cart
        await tx.cart.deleteMany({
          where: { userId, courseId: { in: courseIdArray } },
        });

        // Update course totalStudents
        await tx.course.updateMany({
          where: { id: { in: courseIdArray } },
          data: { totalStudents: { increment: 1 } },
        });

        // Update student profile
        await tx.studentProfile.update({
          where: { userId },
          data: {
            totalCourses: { increment: courseIdArray.length },
            totalSpent: { increment: total },
          },
        });
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    try {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      await prisma.order.create({
        data: {
          orderNumber: `ORD-ERR-${date}-${suffix}`,
          userId: event.data.object.metadata.userId,
          status: "FAILED",
          total: 0,
          paymentId: event.data.object.id,
          billingAddress: JSON.parse(
            event.data.object.metadata.billingDetails || "{}"
          ),
        },
      });
    } catch (logError) {
      console.error("Failed to log failed order:", logError);
    }
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

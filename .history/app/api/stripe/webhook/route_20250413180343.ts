// /api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { orderId, userId, courseIds, promoCode } = paymentIntent.metadata;

    try {
      await prisma.$transaction(async (tx) => {
        // Update Order status
        await tx.order.update({
          where: { id: orderId },
          data: { status: "COMPLETED", paymentId: paymentIntent.id },
        });

        // Create Enrollments
        const courseIdArray = courseIds.split(",");
        await tx.enrollment.createMany({
          data: courseIdArray.map((courseId) => ({
            userId,
            courseId,
            status: "ACTIVE",
          })),
          skipDuplicates: true,
        });

        // Update Coupon usedCount
        if (promoCode) {
          await tx.coupon.update({
            where: { code: promoCode },
            data: { usedCount: { increment: 1 } },
          });
        }

        // Clear Cart
        await tx.cart.deleteMany({ where: { userId } });

        // Update StudentProfile
        const cartItems = await tx.cart.findMany({
          where: { userId },
          include: { course: true },
        });
        const totalSpent = cartItems.reduce(
          (sum, item) => sum + (item.course.discountPrice || item.course.price),
          0
        );
        await tx.studentProfile.update({
          where: { userId },
          data: {
            totalCourses: { increment: courseIdArray.length },
            totalSpent: { increment: totalSpent },
          },
        });
      });
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

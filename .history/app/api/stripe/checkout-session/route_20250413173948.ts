import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { total, promoApplied } = await request.json();
    if (!total || isNaN(total)) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { course: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const amount = Math.round(total * 100); // Convert to cents
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than zero" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always", // For PayPal and other redirect-based methods
      },
      metadata: {
        userId,
        courseIds: cartItems.map((item) => item.courseId).join(","),
        promoApplied: promoApplied.toString(),
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

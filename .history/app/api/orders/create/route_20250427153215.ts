import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paymentIntentId, total, promoCode, billingDetails } =
      await request.json();

    // Fetch course details from metadata or cart
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { courseIds } = paymentIntent.metadata;

    if (!courseIds) {
      return NextResponse.json(
        { error: "No courses in payment intent" },
        { status: 400 }
      );
    }

    const courseIdsArray = courseIds.split(",");
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIdsArray } },
      select: {
        id: true,
        price: true,
        discountPrice: true,
      },
    });

    // Calculate totals
    let subtotal = courses.reduce(
      (sum, course) => sum + (course.discountPrice || course.price),
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
          if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
          }
        } else {
          discount = coupon.discountValue;
        }
        couponId = coupon.id;
      }
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
        total,
        discount,
        tax: 0,
        currency: "AUD",
        paymentMethod: "card",
        paymentId: paymentIntentId,
        couponId,
        billingAddress: billingDetails,
        items: {
          create: courses.map((course) => ({
            courseId: course.id,
            price: course.discountPrice || course.price,
          })),
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

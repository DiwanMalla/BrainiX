---sidebar_position: 4title: Payment Processingdescription: Secure payment processing with Stripe integration---# Payment ProcessingThe BrainiX platform implements secure payment processing using Stripe, featuring multiple payment methods, coupon systems, and order management.## Core Features### Payment Flow`Cart → Coupon Application → Checkout → Payment → Order → Enrollment`### Supported Payment Methods- Credit/Debit Cards (Visa, Mastercard, Amex)- Digital Wallets (Apple Pay, Google Pay)- Bank Transfers (ACH)## Stripe Integration### Checkout Session Creation`` typescript// Stripe Checkout APIexport async function POST(request: Request) {  const { userId } = await auth();  const { promoCode } = await request.json();  // Get cart items  const cartItems = await prisma.cart.findMany({    where: { userId },    include: { course: true }  });  // Apply coupon if provided  let discount = 0;  if (promoCode) {    const coupon = await validateCoupon(promoCode);    discount = calculateDiscount(cartItems, coupon);  }  // Create Stripe session  const session = await stripe.checkout.sessions.create({    mode: 'payment',    payment_method_types: ['card'],    line_items: cartItems.map(item => ({      price_data: {        currency: 'usd',        product_data: { name: item.course.title },        unit_amount: Math.round((item.course.price - discount) * 100),      },      quantity: 1,    })),    success_url: `${process.env.NEXT_PUBLIC_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,    metadata: { userId, promoCode }  });  return Response.json({ sessionUrl: session.url });} ``### Webhook Processing`typescript// Stripe Webhook Handlerexport async function POST(req: Request) {  const body = await req.text();  const signature = req.headers.get('stripe-signature')!;  let event;  try {    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);  } catch (err) {    return new Response('Webhook signature verification failed', { status: 400 });  }  if (event.type === 'checkout.session.completed') {    const session = event.data.object;    await handleSuccessfulPayment(session);  }  return new Response('Success', { status: 200 });}async function handleSuccessfulPayment(session: any) {  const { userId, promoCode } = session.metadata;  // Create order  const order = await prisma.order.create({    data: {      userId,      amount: session.amount_total / 100,      status: 'COMPLETED',      stripeSessionId: session.id    }  });  // Create enrollments  const cartItems = await prisma.cart.findMany({    where: { userId },    include: { course: true }  });  for (const item of cartItems) {    await prisma.enrollment.create({      data: {        userId,        courseId: item.courseId,        enrolledAt: new Date()      }    });  }  // Clear cart  await prisma.cart.deleteMany({ where: { userId } });  // Send confirmation email  await sendEnrollmentConfirmation(userId, cartItems);}`## Coupon System### Coupon Validation`typescriptexport async function validateCoupon(code: string) {  const coupon = await prisma.coupon.findUnique({    where: { code },    include: { applicableCourses: true }  });  if (!coupon) throw new Error('Invalid coupon code');  if (coupon.expiresAt < new Date()) throw new Error('Coupon expired');  if (coupon.usageCount >= coupon.maxUses) throw new Error('Coupon usage limit reached');  return coupon;}export function calculateDiscount(cartItems: any[], coupon: any) {  let discount = 0;  for (const item of cartItems) {    // Check if coupon applies to this course    const applies = coupon.applicableCourses.length === 0 ||                    coupon.applicableCourses.some(c => c.id === item.courseId);    if (applies) {      if (coupon.type === 'PERCENTAGE') {        discount += (item.course.price * coupon.value) / 100;      } else {        discount += Math.min(coupon.value, item.course.price);      }    }  }  return discount;}`### Coupon Management`typescript// Admin coupon creationexport async function createCoupon(data: CouponData) {  return await prisma.coupon.create({    data: {      code: data.code.toUpperCase(),      type: data.type, // PERCENTAGE or FIXED      value: data.value,      maxUses: data.maxUses,      expiresAt: data.expiresAt,      applicableCourses: {        connect: data.courseIds?.map(id => ({ id })) || []      }    }  });}`## Cart Management### Cart Operations```typescript// Add to cartexport async function addToCart(userId: string, courseId: string) { // Check if already enrolled const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }); if (enrollment) throw new Error('Already enrolled in this course'); // Check if already in cart
const existingItem = await prisma.cart.findUnique({
where: { userId_courseId: { userId, courseId } }
});

if (existingItem) throw new Error('Course already in cart');

return await prisma.cart.create({
data: { userId, courseId }
});
}

// Remove from cart
export async function removeFromCart(userId: string, courseId: string) {
return await prisma.cart.delete({
where: { userId_courseId: { userId, courseId } }
});
}

// Get cart contents
export async function getCart(userId: string) {
return await prisma.cart.findMany({
where: { userId },
include: {
course: {
select: {
id: true,
title: true,
price: true,
thumbnail: true,
instructor: { select: { name: true } }
}
}
}
});
}

````

## Order Management

### Order Status Tracking

```typescript
export async function getOrderHistory(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          course: {
            select: { title: true, thumbnail: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function refundOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) throw new Error('Order not found');

  // Process Stripe refund
  const refund = await stripe.refunds.create({
    payment_intent: order.stripeSessionId,
  });

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'REFUNDED' }
  });

  // Remove enrollments
  for (const item of order.items) {
    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: order.userId,
          courseId: item.courseId
        }
      }
    });
  }

  return refund;
}
````

## Security Features

### Payment Security

- PCI DSS compliant through Stripe
- Secure tokenization of payment methods
- Fraud detection and prevention
- 3D Secure authentication for cards

### Data Protection

```typescript
// Sanitize payment data
export function sanitizePaymentData(data: any) {
  const { cardNumber, cvv, ...safe } = data;
  return safe; // Never store sensitive card data
}

// Validate payment amounts
export function validatePaymentAmount(amount: number) {
  if (amount <= 0) throw new Error("Invalid payment amount");
  if (amount > 10000) throw new Error("Payment amount too large");
  return true;
}
```

This payment system ensures secure, reliable transactions while providing excellent user experience and comprehensive administrative controls.

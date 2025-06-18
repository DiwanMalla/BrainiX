# Payment Processing

The BrainiX platform implements secure payment processing using Stripe, featuring multiple payment methods, coupon systems, and order management.

## Core Features

### Payment Flow
```
Cart → Coupon Application → Checkout → Payment → Order → Enrollment
```

### Supported Payment Methods
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers (ACH)

## Stripe Integration

### Checkout Session Creation

```typescript
// Stripe Checkout API
export async function POST(request: Request) {
  const { userId } = await auth();
  const { promoCode } = await request.json();

  // Get cart items
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { course: true }
  });

  // Apply coupon if provided
  let discount = 0;
  if (promoCode) {
    const coupon = await validateCoupon(promoCode);
    discount = calculateDiscount(cartItems, coupon);
  }

  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.course.title },
        unit_amount: Math.round((item.course.price - discount) * 100),
      },
      quantity: 1,
    })),
    success_url: `${process.env.NEXT_PUBLIC_URL}/thank-you`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: { userId, promoCode },
  });

  return NextResponse.json({ sessionId: session.id });
}
```

## Coupon System

### Coupon Types
- **Fixed Amount**: $10 off
- **Percentage**: 20% off
- **Course-specific**: Applies to specific courses only

```typescript
interface Coupon {
  id: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE';
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  courseId?: string; // Optional course restriction
}

// Coupon validation
export async function validateCoupon(code: string): Promise<Coupon | null> {
  const coupon = await prisma.coupon.findUnique({
    where: { 
      code,
      isActive: true,
      expiresAt: { gt: new Date() },
      usedCount: { lt: prisma.coupon.fields.maxUses }
    }
  });
  
  return coupon;
}
```

## Order Management

### Order Creation

```typescript
// Create order after successful payment
export async function createOrder(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const { userId, promoCode } = session.metadata;

  const order = await prisma.order.create({
    data: {
      userId,
      amount: session.amount_total / 100,
      stripeSessionId: sessionId,
      status: 'COMPLETED',
      promoCode,
      items: {
        create: cartItems.map(item => ({
          courseId: item.courseId,
          price: item.course.price,
        }))
      }
    }
  });

  // Auto-enroll user in purchased courses
  await enrollUserInCourses(userId, cartItems);
  
  return order;
}
```

## Webhook Processing

### Stripe Webhooks

```typescript
// Handle Stripe events
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
```

## Security Features

- **PCI DSS Compliance** through Stripe
- **Webhook signature verification**
- **Secure token handling**
- **Fraud detection** via Stripe Radar
- **3D Secure authentication** for enhanced security

## Revenue Analytics

### Instructor Dashboard

```typescript
// Revenue tracking for instructors
export async function getInstructorRevenue(instructorId: string) {
  const revenue = await prisma.orderItem.aggregate({
    where: {
      course: { instructorId },
      order: { status: 'COMPLETED' }
    },
    _sum: { price: true },
    _count: true
  });

  return {
    totalRevenue: revenue._sum.price || 0,
    totalSales: revenue._count,
    // Additional analytics...
  };
}
```

## Error Handling

- **Payment failures** - Graceful error messages
- **Network issues** - Retry mechanisms
- **Invalid coupons** - Clear validation feedback
- **Webhook failures** - Automatic retry with exponential backoff

---

*The payment system ensures secure, reliable transactions while providing flexibility for various pricing strategies and promotional campaigns.*

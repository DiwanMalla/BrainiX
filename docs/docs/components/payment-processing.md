# Payment Processing

The BrainiX platform implements a secure and comprehensive payment processing system using Stripe, featuring multiple payment methods, advanced coupon systems, and robust order management.

## Overview

The payment system provides:
- **Secure Payment Processing** with Stripe integration
- **Multiple Payment Methods** (cards, digital wallets)
- **Advanced Coupon System** with flexible discount rules
- **Order Management** with detailed tracking
- **Webhook Processing** for real-time updates
- **Refund Management** with automated processing
- **Revenue Analytics** for instructors and admins

## Architecture

### Payment Flow

```
Cart → Coupon Application → Checkout Session → Payment Processing → Order Creation → Enrollment → Confirmation
```

### Core Components

```typescript
interface PaymentSystem {
  cart: CartManager;
  coupons: CouponSystem;
  checkout: CheckoutProcessor;
  orders: OrderManager;
  webhooks: WebhookHandler;
  analytics: RevenueAnalytics;
}
```

## Stripe Integration

### Checkout Session Creation

```typescript
// Stripe Checkout Session API (/app/api/stripe/checkout-session/route.ts)
export async function POST(request: Request) {
  const { userId } = await auth();
  const { promoCode, billingDetails } = await request.json();

  try {
    // Get user's cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId: userData.id },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.course.discountPrice || item.course.price;
      return total + Number(price);
    }, 0);

    // Apply coupon if provided
    let discount = 0;
    let coupon = null;
    
    if (promoCode) {
      coupon = await validateAndApplyCoupon(promoCode, subtotal, userData.id);
      if (coupon) {
        discount = calculateDiscount(coupon, subtotal);
      }
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // Create Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.course.title,
          description: item.course.shortDescription || '',
          images: item.course.thumbnail ? [item.course.thumbnail] : [],
          metadata: {
            courseId: item.course.id,
            instructorId: item.course.instructorId,
          },
        },
        unit_amount: Math.round(
          (item.course.discountPrice || item.course.price) * 100
        ), // Convert to cents
      },
      quantity: 1,
    }));

    // Add discount as a separate line item if applicable
    if (discount > 0 && coupon) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Discount: ${coupon.code}`,
            description: `${coupon.discountType === 'PERCENTAGE' ? 
              `${coupon.discountValue}% off` : 
              `$${coupon.discountValue} off`}`,
          },
          unit_amount: -Math.round(discount * 100), // Negative amount for discount
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: userData.email,
      metadata: {
        userId: userData.id,
        couponId: coupon?.id || '',
        cartItems: JSON.stringify(cartItems.map(item => ({
          courseId: item.course.id,
          price: item.course.discountPrice || item.course.price,
        }))),
      },
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          userId: userData.id,
          orderType: 'course_purchase',
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Payment Verification

```typescript
// Payment Session Verification
export async function verifyPaymentSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    return {
      sessionId: session.id,
      paymentIntentId: session.payment_intent?.id,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      metadata: session.metadata,
      lineItems: session.line_items?.data || [],
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    throw new Error('Failed to verify payment');
  }
}
```

## Advanced Coupon System

### Coupon Structure

```typescript
// Coupon Database Model
model Coupon {
  id              String        @id @default(cuid())
  code            String        @unique
  description     String?
  discountType    DiscountType  // PERCENTAGE or FIXED
  discountValue   Decimal       @db.Decimal(10, 2)
  
  // Usage constraints
  maxUses         Int?          // Maximum total uses
  usedCount       Int           @default(0)
  maxUsesPerUser  Int?          // Maximum uses per user
  
  // Validity period
  validFrom       DateTime      @default(now())
  validUntil      DateTime?
  
  // Conditions
  minimumAmount   Decimal?      @db.Decimal(10, 2)
  applicableTo    String[]      // Course IDs or categories
  
  // Tracking
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relationships
  creator         User          @relation(fields: [creatorId], references: [id])
  creatorId       String
  orders          Order[]
  
  @@map("coupons")
}

enum DiscountType {
  PERCENTAGE
  FIXED
}
```

### Coupon Validation System

```typescript
// Advanced Coupon Validation
export class CouponValidator {
  static async validateCoupon(
    code: string,
    userId: string,
    cartTotal: number,
    courseIds: string[]
  ): Promise<CouponValidationResult> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        orders: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!coupon) {
      return { isValid: false, error: 'Invalid coupon code' };
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return { isValid: false, error: 'This coupon is no longer active' };
    }

    // Check validity period
    const now = new Date();
    if (coupon.validFrom > now) {
      return { isValid: false, error: 'This coupon is not yet valid' };
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return { isValid: false, error: 'This coupon has expired' };
    }

    // Check maximum uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, error: 'This coupon has reached its usage limit' };
    }

    // Check per-user usage limit
    if (coupon.maxUsesPerUser) {
      const userUsageCount = coupon.orders.length;
      if (userUsageCount >= coupon.maxUsesPerUser) {
        return { 
          isValid: false, 
          error: 'You have reached the usage limit for this coupon' 
        };
      }
    }

    // Check minimum amount
    if (coupon.minimumAmount && cartTotal < Number(coupon.minimumAmount)) {
      return {
        isValid: false,
        error: `Minimum order amount of $${coupon.minimumAmount} required`,
      };
    }

    // Check applicable courses/categories
    if (coupon.applicableTo.length > 0) {
      const isApplicable = await this.checkCourseApplicability(
        coupon.applicableTo,
        courseIds
      );
      
      if (!isApplicable) {
        return {
          isValid: false,
          error: 'This coupon is not applicable to items in your cart',
        };
      }
    }

    // Calculate discount
    const discount = this.calculateDiscount(coupon, cartTotal);

    return {
      isValid: true,
      coupon,
      discount,
      finalAmount: Math.max(0, cartTotal - discount),
    };
  }

  private static calculateDiscount(coupon: Coupon, amount: number): number {
    if (coupon.discountType === 'PERCENTAGE') {
      return (amount * Number(coupon.discountValue)) / 100;
    } else {
      return Math.min(Number(coupon.discountValue), amount);
    }
  }

  private static async checkCourseApplicability(
    applicableTo: string[],
    courseIds: string[]
  ): Promise<boolean> {
    // Get courses with their categories
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, categoryId: true },
    });

    // Check if any course or category matches
    return courses.some(course => 
      applicableTo.includes(course.id) || 
      applicableTo.includes(course.categoryId)
    );
  }
}
```

### Coupon Management API

```typescript
// Coupon API (/app/api/coupon/route.ts)
export async function POST(req: Request) {
  const { code, cartTotal, courseIds } = await req.json();
  const { userId } = await auth();

  if (!code || !cartTotal || !courseIds) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const validation = await CouponValidator.validateCoupon(
      code,
      userData.id,
      cartTotal,
      courseIds
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: validation.coupon.id,
        code: validation.coupon.code,
        description: validation.coupon.description,
        discountType: validation.coupon.discountType,
        discountValue: validation.coupon.discountValue,
      },
      discount: validation.discount,
      finalAmount: validation.finalAmount,
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
```

## Order Management

### Order Creation

```typescript
// Order Processing Service
export class OrderProcessor {
  static async createOrderFromSession(sessionId: string): Promise<Order> {
    const session = await verifyPaymentSession(sessionId);
    const metadata = session.metadata;
    
    if (!metadata.userId) {
      throw new Error('User ID not found in session metadata');
    }

    const cartItems = JSON.parse(metadata.cartItems);
    
    // Create order
    const order = await prisma.order.create({
      data: {
        userId: metadata.userId,
        orderNumber: await this.generateOrderNumber(),
        paymentIntentId: session.paymentIntentId,
        stripeSessionId: sessionId,
        subtotal: this.calculateSubtotal(cartItems),
        discount: this.calculateDiscount(metadata.couponId, cartItems),
        total: session.amountTotal,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        couponId: metadata.couponId || null,
        items: {
          create: cartItems.map((item: any) => ({
            courseId: item.courseId,
            price: item.price,
            title: item.title,
          })),
        },
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
        coupon: true,
      },
    });

    // Process post-order actions
    await this.processPostOrderActions(order);
    
    return order;
  }

  private static async processPostOrderActions(order: Order) {
    // Create enrollments for purchased courses
    await this.createEnrollments(order);
    
    // Clear user's cart
    await this.clearUserCart(order.userId);
    
    // Update coupon usage
    if (order.couponId) {
      await this.updateCouponUsage(order.couponId);
    }
    
    // Update course statistics
    await this.updateCourseStats(order);
    
    // Send confirmation email
    await this.sendOrderConfirmation(order);
    
    // Update instructor revenue
    await this.updateInstructorRevenue(order);
  }

  private static async createEnrollments(order: Order) {
    const enrollments = order.items.map(item => ({
      userId: order.userId,
      courseId: item.courseId,
      enrolledAt: new Date(),
      status: 'ACTIVE' as const,
    }));

    await prisma.enrollment.createMany({
      data: enrollments,
    });
  }

  private static async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BX-${timestamp}-${random}`.toUpperCase();
  }
}
```

### Order Tracking

```typescript
// Order Details API (/app/api/orders/[orderNumber]/route.ts)
export async function GET(
  req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const { userId } = await auth();
  const { orderNumber } = params;

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId: userData.id,
      },
      include: {
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                instructor: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        coupon: {
          select: {
            code: true,
            description: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
```

## Webhook Processing

### Stripe Webhooks

```typescript
// Stripe Webhook Handler (/app/api/webhooks/stripe/route.ts)
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Dispute);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.id) return;

  try {
    // Create order from session
    const order = await OrderProcessor.createOrderFromSession(session.id);
    
    console.log(`Order created: ${order.orderNumber}`);
  } catch (error) {
    console.error('Failed to create order from session:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update order payment status
  await prisma.order.updateMany({
    where: { paymentIntentId: paymentIntent.id },
    data: { 
      paymentStatus: 'PAID',
      paidAt: new Date(),
    },
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update order payment status
  await prisma.order.updateMany({
    where: { paymentIntentId: paymentIntent.id },
    data: { 
      paymentStatus: 'FAILED',
      status: 'CANCELLED',
    },
  });
}
```

## Revenue Analytics

### Instructor Revenue Dashboard

```typescript
// Revenue Analytics for Instructors
export function InstructorRevenue({ instructorId }: InstructorRevenueProps) {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchRevenueData();
  }, [instructorId, timeRange]);

  const fetchRevenueData = async () => {
    const response = await fetch(
      `/api/instructor/revenue?range=${timeRange}`
    );
    const data = await response.json();
    setRevenueData(data);
  };

  if (!revenueData) return <RevenueSkeleton />;

  return (
    <div className="instructor-revenue">
      <div className="revenue-header">
        <h2>Revenue Analytics</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Revenue Overview */}
      <div className="revenue-overview">
        <RevenueCard
          title="Total Revenue"
          value={formatCurrency(revenueData.totalRevenue)}
          change={revenueData.revenueChange}
          period={timeRange}
        />
        <RevenueCard
          title="Total Sales"
          value={revenueData.totalSales}
          change={revenueData.salesChange}
          period={timeRange}
        />
        <RevenueCard
          title="Average Order Value"
          value={formatCurrency(revenueData.averageOrderValue)}
          change={revenueData.aovChange}
          period={timeRange}
        />
        <RevenueCard
          title="Active Students"
          value={revenueData.activeStudents}
          change={revenueData.studentsChange}
          period={timeRange}
        />
      </div>

      {/* Revenue Chart */}
      <Card className="revenue-chart">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenueData.chartData} />
        </CardContent>
      </Card>

      {/* Course Performance */}
      <Card className="course-performance">
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseRevenueTable courses={revenueData.coursePerformance} />
        </CardContent>
      </Card>
    </div>
  );
}
```

### Revenue API

```typescript
// Revenue Analytics API (/app/api/instructor/revenue/route.ts)
export async function GET(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || 'month';

  try {
    // Verify instructor role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { instructorProfile: true },
    });

    if (user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const dateRange = getDateRange(range);
    
    // Get revenue data
    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        items: {
          some: {
            course: {
              instructorId: user.id,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    // Calculate analytics
    const analytics = calculateRevenueAnalytics(orders, dateRange);
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

function calculateRevenueAnalytics(orders: Order[], dateRange: DateRange) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalSales = orders.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Group by course
  const coursePerformance = groupOrdersByCourse(orders);
  
  // Daily revenue data for chart
  const chartData = generateDailyRevenueData(orders, dateRange);

  return {
    totalRevenue,
    totalSales,
    averageOrderValue,
    coursePerformance,
    chartData,
    // Calculate period-over-period changes
    revenueChange: calculateChange(totalRevenue, dateRange),
    salesChange: calculateChange(totalSales, dateRange),
    aovChange: calculateChange(averageOrderValue, dateRange),
  };
}
```

## Security Measures

### Payment Security

1. **PCI Compliance** - Stripe handles sensitive card data
2. **SSL/TLS Encryption** - All payment data encrypted in transit
3. **Webhook Signature Verification** - Validates webhook authenticity
4. **Fraud Detection** - Stripe's built-in fraud prevention
5. **3D Secure** - Additional authentication for European cards

### Order Validation

```typescript
// Order Validation Middleware
export async function validateOrderAccess(
  userId: string,
  orderId: string
): Promise<boolean> {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  return !!order;
}

// Payment Intent Validation
export async function validatePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not completed');
  }

  return paymentIntent;
}
```

## Testing

### Payment Testing

```typescript
describe('Payment Processing', () => {
  test('should create checkout session successfully', async () => {
    const cartItems = [{ courseId: 'course-1', price: 99.99 }];
    
    const session = await createCheckoutSession({
      userId: 'user-1',
      cartItems,
      promoCode: null,
    });

    expect(session).toBeDefined();
    expect(session.url).toContain('checkout.stripe.com');
  });

  test('should apply coupon correctly', async () => {
    const coupon = await createTestCoupon({
      code: 'TEST50',
      discountType: 'PERCENTAGE',
      discountValue: 50,
    });

    const validation = await CouponValidator.validateCoupon(
      'TEST50',
      'user-1',
      100,
      ['course-1']
    );

    expect(validation.isValid).toBe(true);
    expect(validation.discount).toBe(50);
  });

  test('should process webhook correctly', async () => {
    const mockSession = createMockCheckoutSession();
    
    await handleCheckoutCompleted(mockSession);
    
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: mockSession.id },
    });

    expect(order).toBeDefined();
    expect(order.status).toBe('COMPLETED');
  });
});
```

The payment processing system ensures secure, reliable transactions while providing comprehensive order management and revenue analytics for all stakeholders.

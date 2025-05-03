"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  discount: number;
  tax: number;
  currency: string;
  paymentMethod: string | null;
  paymentId: string | null;
  billingAddress: {
    name: string;
    email: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  } | null;
  coupon: { code: string } | null;
  items: {
    id: string;
    course: {
      id: string;
      title: string;
      thumbnail: string | null;
      price: number;
      discountPrice: number | null;
      instructor: { name: string };
    };
    price: number;
  }[];
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderNumber = searchParams.get("orderNumber");
  console.log("Order Number:", orderNumber);

  useEffect(() => {
    if (!orderNumber) {
      toast({
        title: "Error",
        description: "No order number provided.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }
        setOrder(data);
      } catch (err: unknown) {
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Unable to load order details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, toast]);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-foreground text-lg">Loading order details...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn’t find the order details. Please contact support.
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-10">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold mt-4">
            Thank You for Your Purchase!
          </h1>
          <p className="text-muted-foreground mt-2">
            Your order has been successfully placed. You’ll receive a
            confirmation email soon.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details - #{order.orderNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-4 mt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-24 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.course.thumbnail || "/placeholder.svg"}
                        alt={item.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.course.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.course.instructor.name}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        A${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold">Billing Details</h3>
              {order.billingAddress ? (
                <div className="text-sm text-muted-foreground mt-2">
                  <p>{order.billingAddress.name}</p>
                  <p>{order.billingAddress.email}</p>
                  <p>{order.billingAddress.address.line1}</p>
                  <p>
                    {order.billingAddress.address.city},{" "}
                    {order.billingAddress.address.state}{" "}
                    {order.billingAddress.address.postal_code}
                  </p>
                  <p>{order.billingAddress.address.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  No billing address provided.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold">Payment Summary</h3>
              <div className="text-sm mt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>A${(order.total + order.discount).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({order.coupon?.code || "Promo"}):</span>
                    <span>-A${order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>A${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>A${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod || "Card"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">
                    {order.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Secured by Stripe</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/courses">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my-learning">View My Courses</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

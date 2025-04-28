"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import RecommendedCourse from "@/components/RecommendedCourse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Heart,
  Trash2,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  slug: string;
  title: string;
  instructor: { name: string };
  price: number;
  discountPrice: number | null;
  discount?: number;
  thumbnail: string;
}

interface RecommendedCourseType {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  price: number;
  discount?: number;
  thumbnail: string;
}

export default function CartPage() {
  const { user } = useUser();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<
    "PERCENTAGE" | "FIXED_AMOUNT"
  >("PERCENTAGE");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cart items
        const cartResponse = await fetch("/api/cart");
        if (!cartResponse.ok) throw new Error("Failed to fetch cart");
        const cartData = await cartResponse.json();
        setCartItems(cartData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = promoApplied ? discountValue : 0;
  const total =
    subtotal -
    (discountType === "PERCENTAGE" ? (subtotal * discount) / 100 : discount);

  const applyPromoCode = async () => {
    try {
      const response = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      if (!response.ok) {
        setPromoError(true);
        setPromoApplied(false);
        toast({
          title: "Error",
          description: "Invalid promo code",
          variant: "destructive",
        });
        return;
      }

      const { discount, discountType } = await response.json();
      setPromoApplied(true);
      setPromoError(false);
      setDiscountValue(discount);
      setDiscountType(discountType);
      toast({
        title: "Promo code applied",
        description: `${discount}${
          discountType === "PERCENTAGE" ? "%" : "$"
        } discount applied`,
      });
    } catch (error) {
      console.error(error);
      setPromoError(true);
      setPromoApplied(false);
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (!response.ok) throw new Error("Failed to remove from cart");

      setCartItems(cartItems.filter((item) => item.id !== courseId));
      toast({
        title: "Removed from cart",
        description: "Course has been removed from your cart",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to remove course from cart",
        variant: "destructive",
      });
    }
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: item.id }),
      });
      if (!response.ok) throw new Error("Failed to move to wishlist");

      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
      toast({
        title: "Moved to wishlist",
        description: "Course has been moved to your wishlist",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to move course to wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (course: RecommendedCourseType) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");

      const newCartItem = await response.json();
      setCartItems([...cartItems, newCartItem]);
      toast({
        title: "Added to cart",
        description: `${course.title} has been added to your cart`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add course to cart",
        variant: "destructive",
      });
    }
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative h-40 md:h-28 md:w-48 rounded-md overflow-hidden">
                            <Image
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <Link href={`/courses/${item.slug}`}>
                              <h3 className="font-bold text-lg hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              By {item.instructor.name}
                            </p>
                            <div className="mt-auto flex flex-wrap items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground"
                                onClick={() => handleMoveToWishlist(item)}
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                Move to Wishlist
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-lg font-bold">
                              ${item.price.toFixed(2)}
                            </div>
                            {item.discountPrice && item.discount && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.price.toFixed(2)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.discount}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < cartItems.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommended Courses */}
                <div className="mt-8">
                  <RecommendedCourse cartItems={cartItems} />
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo Discount:</span>
                          <span>
                            -$
                            {(discountType === "PERCENTAGE"
                              ? (subtotal * discount) / 100
                              : discount
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>

                      {/* Promo Code */}
                      <div className="mt-4 pt-4 border-t">
                        <label className="text-sm font-medium mb-2 block">
                          Apply Promo Code
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className={promoError ? "border-red-500" : ""}
                          />
                          <Button variant="outline" onClick={applyPromoCode}>
                            Apply
                          </Button>
                        </div>
                        {promoError && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            <span>Invalid promo code</span>
                          </div>
                        )}
                        {promoApplied && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Promo code applied successfully!</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Try code: BRAINIX10 for 10% off
                        </p>
                      </div>

                      <Button
                        className="w-full mt-4"
                        size="lg"
                        onClick={proceedToCheckout}
                      >
                        Proceed to Checkout
                      </Button>

                      <p className="text-xs text-center text-muted-foreground mt-2">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-3 rounded-full bg-muted mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any courses to your cart yet.
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import {
  dispatchCartUpdate,
  listenToCartUpdate,
  dispatchWishlistUpdate,
} from "@/lib/event";
import { useCart, CartItem } from "@/lib/cart-context"; // Correct import
import RecommendedCourse from "@/components/course/RecommendedCourse";

export default function CartPage() {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const { cartItems, setCartItems, isLoading: cartLoading } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToCartUpdate(() => {
      // CartProvider handles fetch, so this just ensures sync
    });
    return () => unsubscribe();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );
  const discount = promoApplied ? 10 : 0;
  const total = subtotal - (subtotal * discount) / 100;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "brainix10") {
      setPromoApplied(true);
      setPromoError(false);
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order",
      });
    } else {
      setPromoError(true);
      setPromoApplied(false);
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code",
      });
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    if (!user) {
      toast({ title: "Please sign in to manage your cart" });
      router.push("/auth?tab=signin");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });

      if (!res.ok) throw new Error("Failed to remove from cart");

      setCartItems(cartItems.filter((item) => item.id !== id));
      dispatchCartUpdate();
      toast({
        title: "Removed from cart",
        description: "Course has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({ title: "Error", description: "Failed to remove from cart" });
    }
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    if (!user) {
      toast({ title: "Please sign in to manage your wishlist" });
      router.push("/auth?tab=signin");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: item.id }),
      });

      if (!res.ok) throw new Error("Failed to add to wishlist");

      await handleRemoveFromCart(item.id); // Remove from cart after adding to wishlist
      dispatchWishlistUpdate();
      toast({
        title: "Moved to wishlist",
        description: "Course has been moved to your wishlist",
      });
    } catch (error) {
      console.error("Error moving to wishlist:", error);
      toast({ title: "Error", description: "Failed to move to wishlist" });
    }
  };

  const handleAddRecommendedCourse = async (course: any) => {
    if (!user) {
      toast({ title: "Please sign in to add to cart" });
      router.push("/auth?tab=signin");
      return;
    }

    if (cartItems.some((item) => item.id === course.id)) {
      toast({
        title: "Already in cart",
        description: `${course.title} is already in your cart`,
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      const newCartItem: CartItem = await res.json();
      setCartItems([...cartItems, newCartItem]);
      dispatchCartUpdate();
      toast({
        title: "Added to cart",
        description: `${course.title} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add to cart" });
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      toast({ title: "Please sign in to proceed to checkout" });
      router.push("/auth?tab=signin");
      return;
    }
    router.push("/checkout");
  };

  if (cartLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <ShoppingCart className="h-10 w-10 animate-bounce text-primary" />
            <p className="text-lg font-medium">Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Shopping Cart
          </h1>

          {cartItems.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
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
                              By {item.instructor.name || item.instructor}
                            </p>
                            <div className="mt-auto flex flex-wrap items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-500 hover:bg-red-100"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground hover:text-red-500"
                                onClick={() => handleMoveToWishlist(item)}
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                Move to Wishlist
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-lg font-bold">
                              ${(item.discountPrice || item.price).toFixed(2)}
                            </div>
                            {(item.originalPrice || item.discountPrice) &&
                              item.discount && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground line-through">
                                    $
                                    {(item.originalPrice || item.price).toFixed(
                                      2
                                    )}
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

                {/* Dynamic Recommended Courses with cart exclusion */}
                <RecommendedCourse
                  cartItems={cartItems}
                  onAddToCart={handleAddRecommendedCourse}
                />
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-20 shadow-md">
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
                            -${((subtotal * discount) / 100).toFixed(2)}
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
                        <CreditCard className="h-4 w-4 mr-2" />
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
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-muted">
              <div className="inline-block p-3 rounded-full bg-muted mb-4 animate-pulse">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven’t added any courses to your cart yet.
              </p>
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full animate-bounce"
              >
                <Link href="/courses">
                  Browse Courses <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

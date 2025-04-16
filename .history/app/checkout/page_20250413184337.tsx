// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  CreditCard,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Lock,
  Wallet,
  Calendar,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CartItem {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  price: number;
  discountPrice: number | null;
  instructor: {
    name: string;
  };
  rating: number;
  totalStudents: number;
  duration: number;
  level: string;
  totalLessons: number;
  totalModules: number;
  shortDescription: string;
  tags: string[];
  language: string;
  subtitlesLanguages: string[];
  certificateAvailable: boolean;
  published: boolean;
  featured: boolean;
  bestseller: boolean;
  addedAt: string;
}

const CheckoutForm = ({
  total,
  clientSecret,
  paymentType,
  billingDetails,
}: {
  total: number;
  clientSecret: string;
  paymentType: "card" | "wallet" | "pay_later";
  billingDetails: any; // Define type based on your needs
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Payment system not ready");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
          payment_method_data: {
            billing_details: billingDetails, // Pass billing details to Stripe
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        toast({
          title: "Payment Error",
          description: stripeError.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Unexpected error");
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodTypes = {
    card: ["card"],
    wallet: ["card", "apple_pay", "google_pay"],
    pay_later: ["afterpay_clearpay", "klarna"],
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        className="p-4 border rounded-md bg-background"
        options={{
          layout: "tabs",
          paymentMethodTypes: paymentMethodTypes[paymentType],
          wallets:
            paymentType === "wallet"
              ? { applePay: "auto", googlePay: "auto" }
              : undefined,
          defaultValues: {
            billingDetails: {
              name: "",
            },
          },
        }}
      />
      {error && (
        <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full mt-4 gap-2"
        disabled={!stripe || loading}
      >
        <Lock className="h-4 w-4" />
        {loading ? "Processing..." : `Pay A$${total.toFixed(2)}`}
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Secured by Stripe
      </p>
    </form>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<
    "card" | "wallet" | "pay_later"
  >("card");
  const [openCollapsible, setOpenCollapsible] = useState({
    card: true,
    wallet: false,
    pay_later: false,
  });
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("AU");
  const [saveInfo, setSaveInfo] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive",
      });
      router.push("/auth?tab=signin");
    }
  }, [user, router, toast]);

  // Fetch cart items
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user, toast]);

  // Calculate total
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    if (!price) {
      console.log("No valid price for item:", item);
      return sum;
    }
    return sum + Number(price); // Ensure numeric addition
  }, 0);
  const discount = promoApplied ? (subtotal * 10) / 100 : 0;
  const total = subtotal - discount;
  console.log("Cart Items:", JSON.stringify(cartItems, null, 2));
  console.log("Subtotal:", subtotal);
  console.log("Discount:", discount);
  console.log("Total:", total);

  // Fetch clientSecret
  useEffect(() => {
    if (cartItems.length === 0 || !user) return;

    const fetchClientSecret = async () => {
      setClientSecret(null);
      setError(null);
      try {
        const billingDetails = {
          name: `${firstName} ${lastName}`,
          email,
          address: {
            line1: address,
            city,
            state,
            postal_code: zip,
            country,
          },
        };
        const res = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total,
            promoCode,
            paymentType,
            billingDetails,
          }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to initialize payment");
          toast({
            title: "Payment Error",
            description: data.error || "Unable to initialize payment.",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("Unable to connect to payment service");
        toast({
          title: "Connection Error",
          description: "Failed to connect to payment service.",
          variant: "destructive",
        });
      }
    };
    fetchClientSecret();
  }, [
    cartItems,
    total,
    promoCode,
    paymentType,
    user,
    toast,
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    zip,
    country,
  ]); // Removed paymentType dependency

  const applyPromoCode = async () => {
    setPromoError(false);
    setPromoApplied(false);

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total, promoCode, paymentType }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setPromoApplied(true);
        setClientSecret(data.clientSecret);
        toast({
          title: "Promo Applied",
          description: "Discount applied successfully!",
        });
      } else {
        setPromoError(true);
        toast({
          title: "Invalid Promo Code",
          description: data.error || "Please check the code and try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setPromoError(true);
      toast({
        title: "Error",
        description: "Failed to validate promo code.",
        variant: "destructive",
      });
    }
  };

  const handleCollapsibleToggle = (type: "card" | "wallet" | "pay_later") => {
    setPaymentType(type);
    setOpenCollapsible({
      card: type === "card",
      wallet: type === "wallet",
      pay_later: type === "pay_later",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground text-lg">Loading checkout...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">
                Add courses to your cart to checkout
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure payment processing</span>
                  </div>

                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <Collapsible
                        open={openCollapsible.card}
                        onOpenChange={() => handleCollapsibleToggle("card")}
                      >
                        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left font-medium py-2 px-4 rounded-md hover:bg-accent">
                          <CreditCard className="h-5 w-5" />
                          <span>Pay with Credit / Debit Card</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <CheckoutForm
                            total={total}
                            clientSecret={clientSecret}
                            paymentType="card"
                          />
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible
                        open={openCollapsible.wallet}
                        onOpenChange={() => handleCollapsibleToggle("wallet")}
                      >
                        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left font-medium py-2 px-4 rounded-md hover:bg-accent">
                          <Wallet className="h-5 w-5" />
                          <span>Pay with Digital Wallet</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <CheckoutForm
                            total={total}
                            clientSecret={clientSecret}
                            paymentType="wallet"
                          />
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible
                        open={openCollapsible.pay_later}
                        onOpenChange={() =>
                          handleCollapsibleToggle("pay_later")
                        }
                      >
                        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left font-medium py-2 px-4 rounded-md hover:bg-accent">
                          <Calendar className="h-5 w-5" />
                          <span>Pay Later Options</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <CheckoutForm
                            total={total}
                            clientSecret={clientSecret}
                            paymentType="pay_later"
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </Elements>
                  ) : error ? (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Preparing payment options...
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NSW">New South Wales</SelectItem>
                          <SelectItem value="VIC">Victoria</SelectItem>
                          <SelectItem value="QLD">Queensland</SelectItem>
                          <SelectItem value="WA">Western Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="save-info"
                        checked={saveInfo}
                        onCheckedChange={(checked) =>
                          setSaveInfo(checked as boolean)
                        }
                      />
                      <Label htmlFor="save-info">
                        Save this information for next time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={newsletter}
                        onCheckedChange={(checked) =>
                          setNewsletter(checked as boolean)
                        }
                      />
                      <Label htmlFor="newsletter">
                        Receive updates about new courses and promotions
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link href="/cart">Return to Cart</Link>
                </Button>
              </div>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>
                    Order Summary ({cartItems.length}{" "}
                    {cartItems.length === 1 ? "course" : "courses"})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-auto pr-2">
                    {cartItems.map((item) =>
                      !item.course ? null : (
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
                            <h3 className="font-medium text-sm truncate">
                              {item.course.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.course.instructor.name}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              A$
                              {(
                                item.course.discountPrice || item.course.price
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>A${subtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Promo Discount:</span>
                        <span>-A${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>A${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-sm font-medium mb-2 block">
                      Apply Promo Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className={promoError ? "border-destructive" : ""}
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <span>Invalid promo code</span>
                      </div>
                    )}
                    {promoApplied && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Promo code applied successfully!</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    <span>Secure Checkout</span>
                  </div>

                  <div className="mt-4 text-center p-3 bg-muted rounded-md">
                    <p className="text-sm font-semibold">
                      30-Day Money-Back Guarantee
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Full refund within 30 days if not satisfied.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle, FileText, BookOpen } from "lucide-react";
import { getPurchasedCourses } from "@/lib/local-storage";

export default function ThankYouPage() {
  // Get the most recent purchase
  const purchasedCourses = getPurchasedCourses();
  const latestPurchase =
    purchasedCourses.length > 0
      ? purchasedCourses[purchasedCourses.length - 1]
      : null;

  useEffect(() => {
    // Dispatch event to update other components
    window.dispatchEvent(new Event("localStorageChange"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <Card className="border-2 border-primary/10">
            <CardContent className="p-6 md:p-10 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Thank You for Your Purchase!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your order has been successfully processed and your courses are
                now available in your account.
              </p>

              <div className="bg-muted/30 p-4 rounded-lg mb-6 inline-block">
                <div className="text-left">
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">
                      Order Number:
                    </span>
                    <span className="font-medium ml-2">
                      BRX-{Math.floor(Math.random() * 10000000)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="font-medium ml-2">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild>
                  <Link href="/my-learning">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Learning
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/orders">
                    <FileText className="mr-2 h-4 w-4" />
                    View Order Details
                  </Link>
                </Button>
              </div>

              <div className="border-t pt-6">
                <h2 className="font-semibold mb-2">What's Next?</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your email for your purchase receipt</li>
                  <li>• Access your courses anytime from your dashboard</li>
                  <li>• Join our community to connect with other learners</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

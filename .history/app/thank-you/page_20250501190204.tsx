import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ThankYouContent from "./ThankYouContent";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <Suspense
        fallback={
          <main className="flex-1 flex items-center justify-center">
            <p className="text-foreground text-lg">Loading order details...</p>
          </main>
        }
      >
        <ThankYouContent />
      </Suspense>
      <Footer />
    </div>
  );
}

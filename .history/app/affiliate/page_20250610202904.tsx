import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AffiliatePage() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-none px-0 md:px-4 py-12 space-y-12 bg-background">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl mx-auto px-4">
          <div className="flex-1 space-y-4 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Become a BrainiX Affiliate
            </h1>
            <p className="text-lg text-muted-foreground">
              Partner with us and earn rewards by promoting BrainiX courses. Share knowledge, grow your network, and get paid for every successful referral!
            </p>
            <Button asChild className="mt-4">
              <a href="#join" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg">
                Join the Affiliate Program
              </a>
            </Button>
          </div>
          <div className="flex-1 flex justify-center w-full">
            <Image
              src="/business.png"
              alt="Affiliate Program"
              width={320}
              height={220}
              className="rounded-xl shadow-lg w-full max-w-xs md:max-w-md object-cover"
              priority
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-3 w-full max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="list-decimal pl-6 text-muted-foreground space-y-1">
            <li>Sign up for the BrainiX Affiliate Program.</li>
            <li>Get your unique referral link and marketing materials.</li>
            <li>Share BrainiX courses with your audience via social media, blogs, or email.</li>
            <li>Earn a commission for every successful enrollment through your link.</li>
          </ol>
        </section>

        {/* Benefits */}
        <section className="space-y-3 w-full max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold">Affiliate Benefits</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Attractive commission rates on every sale</li>
            <li>Real-time tracking and transparent reporting</li>
            <li>Access to exclusive promotions and resources</li>
            <li>Dedicated affiliate support team</li>
          </ul>
        </section>

        {/* Join Section */}
        <section id="join" className="space-y-2 w-full max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold">Join Now</h2>
          <p className="text-muted-foreground">
            Ready to start earning? Email us at{' '}
            <a
              href="mailto:affiliate@brainix.com"
              className="text-primary underline"
            >
              affiliate@brainix.com
            </a>{' '}
            with your name, contact details, and a brief description of your audience or platform. We’ll get back to you with your affiliate kit and next steps!
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

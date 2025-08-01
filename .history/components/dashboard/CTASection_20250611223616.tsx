import Link from "next/link";
import { Button } from "@/components/ui/button";

type CTASectionProps = {
  isSignedIn: boolean | undefined;
};

export default function CTASection({ isSignedIn }: CTASectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Start Your Learning Journey Today
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed">
              Join millions of learners already on BrainiX and transform your
              career.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            {/* Removed Get Started Button */}
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground "
              asChild
            >
              <Link href={isSignedIn ? "/" : "/auth?tab=signup"}>
                {isSignedIn ? "Go to Dashboard" : "Join for Free"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground "
              asChild
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

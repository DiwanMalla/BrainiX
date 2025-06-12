import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";

type HeroSectionProps = {
  isSignedIn: boolean | undefined;
};

export default function HeroSection({ isSignedIn }: HeroSectionProps) {
  return (
    <section className="w-full py-16 md:py-28 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto max-w-5xl px-4 flex flex-col lg:flex-row items-center gap-10">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            Unlock Your Potential with{" "}
            <span className="text-primary">BrainiX</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            Learn from industry experts and gain in-demand skills with our
            comprehensive online courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href={isSignedIn ? "/dashboard" : "/auth?tab=signup"}>
                {isSignedIn ? "Go to Dashboard" : "Join for Free"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
            {["10K+ Courses", "Expert Instructors", "Lifetime Access"].map(
              (feature) => (
                <span key={feature} className="flex items-center gap-1 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
        {/* Right: Banner Image */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-xl overflow-hidden shadow-lg bg-muted">
            <Image
              src="/homeBanner.jpg"
              alt="Students learning online"
              fill
              className="object-cover"
              priority
              quality={85}
            />
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg bg-background/90 p-3 shadow flex items-center gap-2 border border-border">
            <div className="rounded-full bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Join 1M+ learners</p>
              <p className="text-xs text-muted-foreground">Growing community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

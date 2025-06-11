import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";

type HeroSectionProps = {
  isSignedIn: boolean | undefined;
};

export default function HeroSection({ isSignedIn }: HeroSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Unlock Your Potential with{" "}
                <span className="text-primary">BrainiX</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Learn from industry experts and gain in-demand skills with our
                comprehensive online courses.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href={isSignedIn ? "/my-learning" : "/auth?tab=signup"}>
                  {isSignedIn ? "My Learning" : "Join for Free"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {["10K+ Courses", "Expert Instructors", "Lifetime Access"].map(
                (feature) => (
                  <div key={feature} className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/homeBanner.jpg"
              alt="Students learning online"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover bg-muted"
              width={550}
              height={550}
              priority
              quality={85}
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHyAjIR8qLSgwKy0sLSMrNzI6MTE2OjU+PkJJSFRaX2BfYEdkbGRsXl9giGn/2wBDARUXFx4aHh8gIB9pRDlEaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWn/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-background p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Join 1M+ learners</p>
                  <p className="text-xs text-muted-foreground">
                    Growing community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

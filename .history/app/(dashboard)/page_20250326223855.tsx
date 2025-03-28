"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Globe, Laptop, Users } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Your Potential with{" "}
                    <span className="text-primary">BrainiX</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Learn from industry experts and gain in-demand skills with
                    our comprehensive online courses.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href={isSignedIn ? "/dashboard" : "/auth?tab=signup"}>
                      {isSignedIn ? "Go to Dashboard" : "Join for Free"}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>10K+ Courses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Expert Instructors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Lifetime Access</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <Image
                  src="/homeBanner.jpg"
                  alt="Students learning online"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  width={550}
                  height={550}
                  priority
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

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Why Choose BrainiX
                </span>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Learn Without Limits
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform offers everything you need to advance your career
                  and expand your knowledge.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Laptop className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Learn Anywhere</h3>
                <p className="text-center text-muted-foreground">
                  Access courses on any device, anytime, anywhere.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Expert Instructors</h3>
                <p className="text-center text-muted-foreground">
                  Learn from industry professionals with real-world experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Global Community</h3>
                <p className="text-center text-muted-foreground">
                  Connect with learners and instructors from around the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Popular Courses
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Explore our most popular courses across various categories.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder for CourseCard components */}
            </div>
            <div className="flex justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">View All Courses</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  What Our Students Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Hear from our community of learners who have transformed their
                  careers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder for TestimonialCard components */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Start Your Learning Journey Today
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed">
                  Join millions of learners already on BrainiX and transform
                  your career.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href={isSignedIn ? "/dashboard" : "/auth?tab=signup"}>
                    {isSignedIn ? "Get Started" : "Join for Free"}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeatureSection";
import CoursesSection from "@/components/home/CourseSection";
import TestimonialsSection from "@/components/home/TestonomialSection";
import CTASection from "@/components/home/CTASection";
import { User } from "@clerk/nextjs/server";
// import { getAllCourses } from "@/lib/courses-data"

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex min-h-screen flex-col">
      {User}
      <Navbar />
      <main className="flex-1">
        <HeroSection isSignedIn={isSignedIn} />

        <FeaturesSection />
        <CoursesSection />
        <TestimonialsSection />
        <CTASection isSignedIn={isSignedIn} />
      </main>
      <Footer />
    </div>
  );
}

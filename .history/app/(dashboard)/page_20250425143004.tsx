"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import HeroSection from "@/components/dashboard/HeroSection";
import FeaturesSection from "@/components/dashboard/FeatureSection";
import CoursesSection from "@/components/dashboard/CourseSection";
import TestimonialsSection from "@/components/dashboard/TestonomialSection";
import CTASection from "@/components/dashboard/CTASection";
import { useUser } from "@clerk/nextjs";
import useAuth from "@/hooks/useAuth";

// import { getAllCourses } from "@/lib/courses-data"

export default function Home() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const handleLogToken = async () => {
    const token = await getToken(); // or pass `{ template: "your-template-name" }` if you use token templates
    console.log("JWT Token:", token);
  };
  return (
    <div className="flex min-h-screen flex-col">
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

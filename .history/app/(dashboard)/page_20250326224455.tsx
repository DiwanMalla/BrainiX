"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Globe, Laptop, Users } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
// import CourseCard from "@/components/course-card"
// import TestimonialCard from "@/components/testimonial-card"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
// import { getAllCourses } from "@/lib/courses-data"

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    
  );
}

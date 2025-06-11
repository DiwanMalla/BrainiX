"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CourseCard from "../Card/CourseCard";
import { getCourseThumbnail } from "@/lib/course-images";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  discount?: number;
  rating: number;
  students: number;
  bestseller?: boolean;
  category: { name: string };
  level: string;
  instructor: { name: string };
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">No courses available.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                slug={course.slug}
                title={course.title}
                instructor={course.instructor.name}
                rating={course.rating}
                students={course.students}
                price={course.price}
                image={getCourseThumbnail(course.thumbnail, course.category.name)}
                discount={course.discount}
                bestseller={course.bestseller}
                category={course.category.name}
                level={course.level}
                shortDescription={course.shortDescription}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

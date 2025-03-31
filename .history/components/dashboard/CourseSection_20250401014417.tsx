"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define the course data structure
interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  category: {
    name: string;
  };
  instructor: {
    name: string;
  };
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-lg p-6 rounded-lg"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {course.shortDescription}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">${course.price}</span>
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="sm">View Course</Button>
                  </Link>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Instructor: {course.instructor.name}</p>
                  <p>Category: {course.category.name}</p>
                </div>
              </div>
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

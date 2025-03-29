"use client"; // Required for client-side hooks in App Router

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAllCourses } from "@/lib/course-data"; // Import from your local storage file

// Interfaces (copied from your provided code)
export interface Instructor {
  name: string;
  bio: string;
  image: string;
}

export interface SyllabusItem {
  title: string;
  lectures: number;
  duration: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  instructorDetails: Instructor;
  description: string;
  shortDescription: string;
  image: string;
  rating: number;
  students: number;
  lastUpdated: string;
  language: string;
  level: string;
  duration: string;
  price: number;
  discount?: number;
  bestseller?: boolean;
  category: string;
  whatYoullLearn: string[];
  syllabus: SyllabusItem[];
  topCompanies: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Simulate async fetch from local storage (no actual API call needed)
        const data = getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
        <p className="text-muted-foreground mt-2">
          Explore our wide range of courses taught by industry experts.
        </p>
      </header>

      {/* Courses Grid */}
      <main className="p-6">
        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden transition-shadow hover:shadow-lg border border-muted"
              >
                <div className="relative aspect-video">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  {course.bestseller && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Bestseller
                    </span>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold truncate">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    <span>{course.instructor}</span> •{" "}
                    <span>
                      {course.rating.toFixed(1)} (
                      {course.students.toLocaleString()} students)
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">
                      {course.discount
                        ? `$${(course.price - (course.discount || 0)).toFixed(
                            2
                          )}`
                        : `$${course.price.toFixed(2)}`}
                      {course.discount && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      Enroll Now
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{course.level}</span> • <span>{course.duration}</span>{" "}
                    • <span>{course.language}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-lg text-muted-foreground">
              No courses available yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for new courses!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

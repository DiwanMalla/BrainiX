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

// Define TypeScript interface based on your Prisma Course model
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  thumbnail?: string | null;
  previewVideo?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  bestseller: boolean;
  published: boolean;
  publishedAt?: string | null;
  language: string;
  subtitlesLanguages: string[];
  duration: number; // in minutes
  totalLessons: number;
  totalModules: number;
  requirements: string[];
  learningObjectives: string[];
  targetAudience: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data: Course[] = await response.json();
        // Filter only published courses for public view
        const publishedCourses = data.filter((course) => course.published);
        setCourses(publishedCourses);
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
                    src={course.thumbnail || "/placeholder.svg"}
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
                    {course.shortDescription || course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">
                      ${course.discountPrice || course.price.toFixed(2)}
                      {course.discountPrice && (
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
                    <span>{course.level.toLowerCase()}</span> •{" "}
                    <span>
                      {Math.floor(course.duration / 60)}h {course.duration % 60}
                      m
                    </span>{" "}
                    • <span>{course.totalLessons} lessons</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-lg text-muted-foreground">
              No published courses available yet.
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

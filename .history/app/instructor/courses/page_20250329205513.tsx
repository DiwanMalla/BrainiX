"use client";

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
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { getAllCourses, Course } from "@/lib/course-data";
import Link from "next/link";

const INSTRUCTOR_NAME = "Diwan Malla"; // Replace with auth logic later

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const allCourses = getAllCourses();
        const myCourses = allCourses.filter(
          (course) => course.instructor === INSTRUCTOR_NAME
        );
        setCourses(myCourses);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load your courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6">Loading your courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <Button>Create New Course</Button>
        </div>
        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    {course.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">
                      $
                      {course.discount
                        ? (course.price - course.discount).toFixed(2)
                        : course.price.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <Link href={`/instructor/courses/${course.slug}`}>
                        Edit Course
                      </Link>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{course.students.toLocaleString()} students</span> •{" "}
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-lg text-muted-foreground">
              You haven’t created any courses yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Get started by adding a new course!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

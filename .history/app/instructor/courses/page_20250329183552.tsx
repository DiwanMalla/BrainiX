"use client"; // Add this directive to mark as a client component

import { useEffect, useState } from "react";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { getAllCourses } from "@/lib/course-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user");
        const data = await response.json();

        if (response.ok && data.role === "INSTRUCTOR") {
          setInstructor(data);
          const allCourses = getAllCourses();
          const courses =
            data.role === "admin"
              ? allCourses
              : allCourses.filter((course) =>
                  data.courses.some((c: any) => c.id === course.id)
                );
          setInstructorCourses(courses);
        } else {
          setError(
            data.role !== "INSTRUCTOR"
              ? "Unauthorized: Instructor role required"
              : data.message || "Failed to fetch instructor data"
          );
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructor();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">Loading...</div>
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

  if (!instructor) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">No instructor data available.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {instructor.name}
            </p>
          </div>
          <Button>Create New Course</Button>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted p-1">
            <TabsTrigger value="courses" className="rounded-md py-2">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-md py-2">
              Recent Students
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-md py-2">
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  My Courses
                </h2>
                <Button variant="default" size="sm">
                  Add New Course
                </Button>
              </div>

              {instructorCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorCourses.map((course) => (
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
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-semibold truncate">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          <span>
                            {course.students.toLocaleString()} students
                          </span>{" "}
                          • <span>{course.rating.toFixed(1)} rating</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex items-center justify-between">
                        <span className="text-base font-bold text-primary">
                          ${course.price.toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          Edit Course
                        </Button>
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
                    Start by adding a new course!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Placeholder for other tabs */}
          <TabsContent value="students" className="mt-6">
            <p className="text-muted-foreground">
              Recent students data coming soon...
            </p>
          </TabsContent>
          <TabsContent value="revenue" className="mt-6">
            <p className="text-muted-foreground">Revenue data coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function InstructorsPage() {
  interface Instructor {
    id: string;
    user: {
      name: string;
      image?: string;
    };
    title?: string;
    specialization?: string;
    totalCourses: number;
    totalStudents: number;
    averageRating: number;
  }

  interface Course {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    shortDescription?: string;
    totalStudents?: number;
    rating?: number;
  }

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: Course[] }>({});
  const [expandedInstructor, setExpandedInstructor] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("/api/info/instructor/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const fetchCourses = async (instructorId: string) => {
    try {
      const response = await fetch(
        `/api/courses?instructorId=${instructorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses((prev) => ({ ...prev, [instructorId]: data }));
    } catch (err) {
      console.error(
        `Error fetching courses for instructor ${instructorId}:`,
        err
      );
    }
  };

  const toggleCourses = (instructorId: string) => {
    if (expandedInstructor === instructorId) {
      setExpandedInstructor(null);
    } else {
      setExpandedInstructor(instructorId);
      if (!courses[instructorId]) {
        fetchCourses(instructorId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500" role="alert">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Meet Our Instructors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our talented instructors who are passionate about teaching
            and empowering students.
          </p>
        </header>

        <main>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {instructors.map((instructor) => (
              <Card
                key={instructor.id}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                role="listitem"
              >
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mb-4">
                    <AvatarImage
                      src={instructor.user.image || "/placeholder.svg"}
                      alt={instructor.user.name}
                    />
                    <AvatarFallback>
                      {instructor.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-center">
                    {instructor.user.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 text-center">
                    {instructor.title || "Instructor"}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {instructor.specialization && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-xs sm:text-sm"
                      >
                        {instructor.specialization}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs sm:text-sm"
                    >
                      {instructor.totalCourses} Courses
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-600">Students</span>
                      </div>
                      <span className="font-medium">
                        {instructor.totalStudents.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-600">Rating</span>
                      </div>
                      <span className="font-medium">
                        {instructor.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-600">Courses</span>
                      </div>
                      <span className="font-medium">
                        {instructor.totalCourses}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 text-sm sm:text-base"
                    onClick={() => toggleCourses(instructor.id)}
                    aria-expanded={expandedInstructor === instructor.id}
                    aria-controls={`courses-${instructor.id}`}
                  >
                    View Courses
                    {expandedInstructor === instructor.id ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  {expandedInstructor === instructor.id && (
                    <div
                      id={`courses-${instructor.id}`}
                      className="mt-4 space-y-4 animate-in fade-in duration-300"
                    >
                      {courses[instructor.id]?.length > 0 ? (
                        courses[instructor.id].map((course) => (
                          <div
                            key={course.id}
                            className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() =>
                              (window.location.href = `/courses/${course.slug}`)
                            }
                            role="button"
                            tabIndex={0}
                            aria-label={`View course ${course.title}`}
                          >
                            <img
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="text-sm sm:text-base font-medium">
                                {course.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                {course.shortDescription ||
                                  "No description available"}
                              </p>
                              <div className="flex gap-2 mt-2 text-xs sm:text-sm">
                                <span className="text-gray-500">
                                  {course.totalStudents?.toLocaleString() || 0}{" "}
                                  Students
                                </span>
                                <span className="text-gray-500">
                                  {course.rating?.toFixed(1) || 0} Rating
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center">
                          No courses available
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

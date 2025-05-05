"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

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

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Meet Our Instructors
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our talented instructors who are passionate about teaching
            and empowering students.
          </p>
        </header>

        <main>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
            {instructors.map((instructor) => (
              <Card
                key={instructor.id}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                role="listitem"
              >
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage
                      src={instructor.user.image || "/placeholder.svg"}
                      alt={instructor.user.name}
                    />
                    <AvatarFallback>
                      {instructor.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-semibold text-center">
                    {instructor.user.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 text-center">
                    {instructor.title || "Instructor"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {instructor.specialization && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {instructor.specialization}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {instructor.totalCourses} Courses
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">Students</span>
                      </div>
                      <span className="font-medium">
                        {instructor.totalStudents.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                      <span className="font-medium">
                        {instructor.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">Courses</span>
                      </div>
                      <span className="font-medium">
                        {instructor.totalCourses}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    as="a"
                    href={`/instructors/${instructor.id}`}
                    aria-label={`View profile of ${instructor.user.name}`}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

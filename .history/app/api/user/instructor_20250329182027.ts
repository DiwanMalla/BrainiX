"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { getAllCourses } from "@/lib/course-data";
import {
  BarChart,
  BookOpen,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetch("/api/instructor");
        const data = await response.json();

        if (response.ok) {
          setInstructor(data);
          if (data) {
            const allCourses = getAllCourses();
            const courses =
              data.role === "admin"
                ? allCourses
                : allCourses.filter((course) =>
                    data.courses.some(
                      (courseData: any) => courseData.id === course.id
                    )
                  );
            setInstructorCourses(courses);
          }
        } else {
          setError(data.message || "Failed to fetch instructor data");
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchInstructor();
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // If no instructor data is found
  if (!instructor) {
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">
          <p>No instructor data available.</p>
        </div>
      </div>
    );
  }

  const totalStudents = instructor.students || 0;
  const totalRevenue = instructor.totalRevenue || 0;
  const totalCourses = instructorCourses.length || 0;
  const averageRating =
    instructorCourses.length > 0
      ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) /
        instructorCourses.length
      : 0;

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {instructor.name}
              </p>
            </div>
            <Button>Create New Course</Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Total Revenue</p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    12%
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Other cards remain the same */}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="courses">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="students">Recent Students</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            <TabsContent value="courses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {instructorCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>
                        {course.students.toLocaleString()} students •{" "}
                        {course.rating.toFixed(1)} rating
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex justify-between">
                      <span className="font-bold">
                        ${course.price.toFixed(2)}
                      </span>
                      <Button variant="outline" size="sm">
                        Edit Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {/* Other TabsContent remains the same */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

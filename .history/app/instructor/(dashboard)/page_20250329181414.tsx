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

  useEffect(() => {
    async function fetchInstructorData() {
      try {
        const response = await fetch("/api/instructor");
        const data = await response.json();
        console.log("Fetched instructor data:", data); // Debugging log
        setInstructor(data);

        if (data) {
          // Get instructor's courses
          const allCourses = getAllCourses();
          const courses =
            data.role === "admin"
              ? allCourses
              : allCourses.filter((course) => data.courses.includes(course.id));

          setInstructorCourses(courses);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error); // Debugging log
      }
    }

    fetchInstructorData();
  }, []);

  if (!instructor) {
    return <div>Loading...</div>; // or a loader component
  }

  // Calculate stats as before
  const totalStudents = instructor.students;
  const totalRevenue = instructor.totalRevenue;
  const totalCourses = instructorCourses.length;
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
            {/* Your Stats Cards code */}
          </div>

          {/* Tabs for different views */}
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
            {/* Other Tabs */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

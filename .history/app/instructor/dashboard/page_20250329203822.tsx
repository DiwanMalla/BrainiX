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
import Image from "next/image";

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch instructor data from the API
    const fetchInstructor = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setInstructor(data);
          if (data) {
            const allCourses = getAllCourses();
            const courses =
              data.role === "INSTRUCTOR"
                ? allCourses
                : allCourses.filter((course) =>
                    data.courses.some(
                      (courseData: any) => courseData.id === course.id
                    )
                  );
            setInstructorCourses(courses);
          }
        } else {
          console.error("Instructor not found", data);
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
      }
    };

    fetchInstructor();
  }, []);

  if (!instructor) {
    return null;
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Total Students</p>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {totalStudents.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    8%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Total Courses</p>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalCourses}</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    4%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Average Rating</p>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center text-sm text-red-500">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    2%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
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

            {/* My Courses Tab */}
            <TabsContent value="courses" className="mt-6">
              {instructorCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill // Use fill instead of w-full h-full for better responsiveness
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-semibold truncate">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {course.students.toLocaleString()} students •{" "}
                          {course.rating.toFixed(1)} rating
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between p-4 pt-0">
                        <span className="text-base font-bold text-primary">
                          ${course.price.toFixed(2)}
                        </span>
                        <Button variant="outline" size="sm">
                          Edit Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No courses available yet.
                </p>
              )}
            </TabsContent>

            {/* Recent Students Tab */}
            <TabsContent value="students" className="mt-6">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-lg font-medium">
                    Recent Enrollments
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Students who recently enrolled in your courses
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left font-medium">
                            Student
                          </th>
                          <th className="h-12 px-4 text-left font-medium">
                            Course
                          </th>
                          <th className="h-12 px-4 text-left font-medium">
                            Date
                          </th>
                          <th className="h-12 px-4 text-left font-medium">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(5)].map((_, i) => (
                          <tr
                            key={i}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted" />
                                <div>
                                  <p className="font-medium">Student {i + 1}</p>
                                  <p className="text-xs text-muted-foreground">
                                    student{i + 1}@example.com
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {instructorCourses[i % instructorCourses.length]
                                ?.title || "Course Name"}
                            </td>
                            <td className="p-4 align-middle">
                              {new Date(
                                Date.now() - i * 86400000
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-4 align-middle">
                              $
                              {(
                                instructorCourses[i % instructorCourses.length]
                                  ?.price || 0
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Tab (Placeholder) */}
            <TabsContent value="revenue" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Track your earnings from course sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Revenue data coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

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
          <Tabs defaultValue="courses">
            <TabsList className="flex space-x-4">
              <TabsTrigger
                value="courses"
                className="py-2 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg"
              >
                My Courses
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="py-2 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg"
              >
                Recent Students
              </TabsTrigger>
              <TabsTrigger
                value="revenue"
                className="py-2 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg"
              >
                Revenue
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {instructorCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden shadow-md rounded-lg"
                  >
                    <div className="aspect-video relative">
                      width={500} // Set the width you want height={300} // Set
                      the height you wan
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-semibold">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {course.students.toLocaleString()} students •{" "}
                        {course.rating.toFixed(1)} rating
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex justify-between items-center">
                      <span className="text-xl font-bold">
                        ${course.price.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground hover:bg-muted"
                      >
                        Edit Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-6">
              <div className="rounded-md border bg-white shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Recent Enrollments
                  </h3>
                  <p className="text-sm text-gray-500">
                    Students who recently enrolled in your courses
                  </p>
                </div>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-gray-600">
                    <thead className="bg-gray-100">
                      <tr className="border-b">
                        <th className="h-12 px-6 text-left font-medium text-gray-700">
                          Student
                        </th>
                        <th className="h-12 px-6 text-left font-medium text-gray-700">
                          Course
                        </th>
                        <th className="h-12 px-6 text-left font-medium text-gray-700">
                          Date
                        </th>
                        <th className="h-12 px-6 text-left font-medium text-gray-700">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  Student {i + 1}
                                </p>
                                <p className="text-xs text-gray-500">
                                  student{i + 1}@example.com
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {instructorCourses[i % instructorCourses.length]
                              ?.title || "Course Name"}
                          </td>
                          <td className="p-4">
                            {new Date(
                              Date.now() - i * 86400000
                            ).toLocaleDateString()}
                          </td>
                          <td className="p-4">
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

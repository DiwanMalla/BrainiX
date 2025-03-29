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
import { getCurrentInstructor, type Instructor } from "@/lib/instructor-auth";
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
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);

  useEffect(() => {
    const currentInstructor = getCurrentInstructor();
    setInstructor(currentInstructor);

    if (currentInstructor) {
      // Get instructor's courses
      const allCourses = getAllCourses();
      const courses =
        currentInstructor.role === "admin"
          ? allCourses
          : allCourses.filter((course) =>
              currentInstructor.courses.includes(course.id)
            );

      setInstructorCourses(courses);
    }
  }, []);

  if (!instructor) {
    return null;
  }

  // Calculate total students
  const totalStudents = instructor.students;

  // Calculate total revenue
  const totalRevenue = instructor.totalRevenue;

  // Calculate total courses
  const totalCourses = instructorCourses.length;

  // Calculate average rating
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
            <TabsContent value="students">
              <div className="rounded-md border mt-4">
                <div className="p-4">
                  <h3 className="text-lg font-medium">Recent Enrollments</h3>
                  <p className="text-sm text-muted-foreground">
                    Students who recently enrolled in your courses
                  </p>
                </div>
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Student
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Course
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Date
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
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
                              <div className="h-8 w-8 rounded-full bg-muted"></div>
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
                                ?.price || 49.99
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="revenue">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Your earnings over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Revenue chart would be displayed here
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total Revenue: ${totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

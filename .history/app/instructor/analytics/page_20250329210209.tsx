"use client";

import { useEffect, useState } from "react";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Users, DollarSign, Star, TrendingUp } from "lucide-react";
import { getAllCourses, Course } from "@/lib/course-data";
import { getStudentsByInstructorCourses, Student } from "@/lib/student-data";

export default function InstructorAnalyticsPage() {
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timeRange, setTimeRange] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    const allCourses = getAllCourses();
    const myCourses = allCourses.filter(
      (course) => course.instructor === "Diwan Malla"
    );
    setInstructorCourses(myCourses);

    const courseIds = myCourses.map((course) => course.id);
    const instructorStudents = getStudentsByInstructorCourses(courseIds);
    setStudents(instructorStudents);
  }, []);

  // Analytics Calculations
  const totalStudents = new Set(students.map((s) => s.id)).size;
  const totalEnrollments = students.reduce(
    (acc, student) => acc + student.enrollments.length,
    0
  );
  const totalRevenue = instructorCourses.reduce((acc, course) => {
    const courseEnrollments = students.flatMap((s) =>
      s.enrollments.filter((e) => e.courseId === course.id)
    ).length;
    return acc + courseEnrollments * (course.price - (course.discount || 0));
  }, 0);
  const averageRating =
    instructorCourses.reduce((acc, course) => acc + course.rating, 0) /
      instructorCourses.length || 0;

  const filteredStudents =
    selectedCourse === "all"
      ? students
      : students.filter((s) =>
          s.enrollments.some((e) => e.courseId === selectedCourse)
        );

  const completionRate = filteredStudents.length
    ? (filteredStudents.filter((s) =>
        s.enrollments.some((e) => e.status === "COMPLETED")
      ).length /
        filteredStudents.length) *
      100
    : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Insights into your courses and students
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {instructorCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrollments
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Completion Rate: {completionRate.toFixed(1)}%</p>
              {/* Add Chart.js or Recharts here for enrollment trends */}
              <p className="text-muted-foreground">
                Chart placeholder: Enrollments over time
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Active Students:{" "}
                {
                  filteredStudents.filter((s) =>
                    s.enrollments.some(
                      (e) =>
                        new Date(e.lastActive) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    )
                  ).length
                }
              </p>
              {/* Add pie chart for progress distribution */}
              <p className="text-muted-foreground">
                Chart placeholder: Progress distribution
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add line chart for revenue over time */}
              <p className="text-muted-foreground">
                Chart placeholder: Revenue over time
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

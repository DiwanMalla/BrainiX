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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { getAllCourses, Course } from "@/lib/course-data";
import { getStudentsByInstructorCourses, Student } from "@/lib/student-data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

  // Filter students and enrollments based on selections
  const filteredStudents =
    selectedCourse === "all"
      ? students
      : students.filter((s) =>
          s.enrollments.some((e) => e.courseId === selectedCourse)
        );

  const filteredEnrollments = filteredStudents
    .flatMap((s) => s.enrollments)
    .filter((e) => selectedCourse === "all" || e.courseId === selectedCourse);

  // Apply time range filter
  const now = new Date();
  const timeFilteredEnrollments = filteredEnrollments.filter((e) => {
    if (timeRange === "7days")
      return e.lastActive >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (timeRange === "30days")
      return e.lastActive >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return true; // "all"
  });

  // Overview Metrics
  const totalStudents = new Set(filteredStudents.map((s) => s.id)).size;
  const totalEnrollments = timeFilteredEnrollments.length;
  const totalRevenue = instructorCourses.reduce((acc, course) => {
    const courseEnrollments = timeFilteredEnrollments.filter(
      (e) => e.courseId === course.id
    ).length;
    return acc + courseEnrollments * (course.price - (course.discount || 0));
  }, 0);
  const averageRating =
    instructorCourses.reduce((acc, course) => acc + course.rating, 0) /
      instructorCourses.length || 0;

  // Course Performance
  const completionRate = timeFilteredEnrollments.length
    ? (timeFilteredEnrollments.filter((e) => e.status === "COMPLETED").length /
        timeFilteredEnrollments.length) *
      100
    : 0;

  const enrollmentTrendsData = instructorCourses.map((course) => ({
    name: course.title,
    enrollments: timeFilteredEnrollments.filter((e) => e.courseId === course.id)
      .length,
  }));

  // Student Engagement
  const activeStudents = filteredStudents.filter((s) =>
    s.enrollments.some(
      (e) =>
        new Date(e.lastActive) >
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    )
  ).length;

  const progressDistributionData = [
    {
      name: "0-25%",
      value: timeFilteredEnrollments.filter((e) => e.progress <= 25).length,
    },
    {
      name: "26-50%",
      value: timeFilteredEnrollments.filter(
        (e) => e.progress > 25 && e.progress <= 50
      ).length,
    },
    {
      name: "51-75%",
      value: timeFilteredEnrollments.filter(
        (e) => e.progress > 50 && e.progress <= 75
      ).length,
    },
    {
      name: "76-100%",
      value: timeFilteredEnrollments.filter((e) => e.progress > 75).length,
    },
  ].filter((d) => d.value > 0);

  // Revenue Analytics
  const revenueByCourseData = instructorCourses.map((course) => ({
    name: course.title,
    revenue:
      timeFilteredEnrollments.filter((e) => e.courseId === course.id).length *
      (course.price - (course.discount || 0)),
  }));

  // Export Data as CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Metric", "Value"],
      ["Total Students", totalStudents],
      ["Total Enrollments", totalEnrollments],
      ["Total Revenue", totalRevenue.toFixed(2)],
      ["Average Rating", averageRating.toFixed(1)],
      ["Completion Rate", completionRate.toFixed(1)],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-background">
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
            <Button variant="outline" onClick={exportToCSV}>
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
              <LineChart width={600} height={300} data={enrollmentTrendsData}>
                <Line type="monotone" dataKey="enrollments" stroke="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
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
              <p>Active Students (Last 30 Days): {activeStudents}</p>
              <PieChart width={400} height={300}>
                <Pie
                  data={progressDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {progressDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
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
              <BarChart width={600} height={300} data={revenueByCourseData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

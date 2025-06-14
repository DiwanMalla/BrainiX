"use client";

import { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Course {
  id: string;
  title: string;
  price: number;
  discount?: number;
  rating: number;
}

interface Enrollment {
  courseId: string;
  courseTitle: string;
  status: string;
  progress: number;
  lastActive: string;
}

interface Student {
  id: string;
  enrollments: Enrollment[];
}

export default function InstructorAnalyticsPage() {
  const { user, isLoaded } = useUser();
  const instructorId = user?.id || "";
  const router = useRouter();

  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]); // Flat enrollments for analytics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
  });
  const [timeRange, setTimeRange] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !instructorId) return;

    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats (revenue, students, courses)
        const statsResponse = await fetch("/api/instructor/stats");
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch courses with enrollments
        const coursesResponse = await fetch(
          `/api/instructor/courses?include=enrollments`
        );
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");
        const coursesWithEnrollments = await coursesResponse.json();
        setInstructorCourses(coursesWithEnrollments);

        // Flatten enrollments for analytics
        const allEnrollments = coursesWithEnrollments.flatMap((course: any) =>
          (course.enrollments || []).map((enrollment: any) => ({
            ...enrollment,
            courseId: course.id,
            courseTitle: course.title,
            coursePrice: course.price,
            courseRating: course.rating,
          }))
        );
        setEnrollments(allEnrollments);
      } catch (err) {
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [instructorId, isLoaded]);

  // Filter enrollments by course and time range
  const filteredEnrollments = enrollments.filter((e) =>
    selectedCourse === "all" ? true : e.courseId === selectedCourse
  );
  const now = new Date();
  const timeFilteredEnrollments = filteredEnrollments.filter((e) => {
    const createdAt = new Date(e.createdAt);
    if (timeRange === "7days")
      return createdAt >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (timeRange === "30days")
      return createdAt >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return true;
  });

  // Overview Metrics (use stats for revenue, students, courses)
  const totalStudents = stats.totalStudents;
  const totalEnrollments = timeFilteredEnrollments.length;
  const totalRevenue = stats.totalRevenue;
  const averageRating =
    instructorCourses.length > 0
      ? instructorCourses.reduce(
          (acc, course) => acc + (course.rating || 0),
          0
        ) / instructorCourses.length
      : 0;

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
  const activeStudents = Array.from(
    new Set(
      timeFilteredEnrollments
        .filter(
          (e) =>
            new Date(e.createdAt) >
            new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        )
        .map((e) => e.user?.id || e.userId)
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

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6">Loading authentication...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
          <span className="text-lg text-cyan-100 font-semibold tracking-wide">
            Loading analytics...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#232526] via-[#2c5364] to-[#0f2027]">
        <div className="bg-red-100 dark:bg-red-900/40 p-8 rounded-xl shadow-xl flex flex-col items-center">
          <span className="text-2xl text-red-600 dark:text-red-300 mb-2">
            Error
          </span>
          <span className="text-lg text-red-800 dark:text-red-200">
            {error}
          </span>
          <Button
            className="mt-6"
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-foreground">
      <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-cyan-100 drop-shadow-lg mb-1">
              Analytics
            </h1>
            <p className="text-cyan-200/80 text-lg font-medium">
              Insights into your courses and students
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-cyan-900/60 border-cyan-700 text-cyan-100">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-cyan-950 border-cyan-700 text-cyan-100">
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px] bg-cyan-900/60 border-cyan-700 text-cyan-100">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent className="bg-cyan-950 border-cyan-700 text-cyan-100">
                <SelectItem value="all">All Courses</SelectItem>
                {instructorCourses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.id}
                    className="text-cyan-100"
                  >
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-100 hover:bg-cyan-900/30"
              onClick={exportToCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 border-none shadow-xl hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-cyan-100 drop-shadow-lg">
                {totalStudents}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 border-none shadow-xl hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">
                Total Enrollments
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-cyan-100 drop-shadow-lg">
                {totalEnrollments}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 border-none shadow-xl hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-cyan-100 drop-shadow-lg">
                {totalRevenue > 0 ? (
                  `$${totalRevenue.toFixed(2)}`
                ) : (
                  <span className="text-base text-cyan-400">
                    No revenue yet
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 border-none shadow-xl hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">
                Average Rating
              </CardTitle>
              <Star className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-cyan-100 drop-shadow-lg">
                {averageRating > 0 ? (
                  averageRating.toFixed(1)
                ) : (
                  <span className="text-base text-cyan-400">N/A</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Performance */}
        <Card className="bg-gradient-to-b from-cyan-950/80 to-cyan-900/80 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-cyan-100 font-bold">
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-cyan-200/90 font-medium">
                Completion Rate:{" "}
                <span className="font-bold text-cyan-100">
                  {completionRate > 0 ? (
                    `${completionRate.toFixed(1)}%`
                  ) : (
                    <span className="text-cyan-400">No completions yet</span>
                  )}
                </span>
              </p>
              <div className="overflow-x-auto">
                {enrollmentTrendsData.every((d) => d.enrollments === 0) ? (
                  <div className="text-cyan-400 text-center py-12 text-lg font-medium">
                    No enrollment data yet
                  </div>
                ) : (
                  <LineChart
                    width={600}
                    height={300}
                    data={enrollmentTrendsData}
                    style={{ background: "transparent" }}
                  >
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#22d3ee" }}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#bae6fd"
                      tick={{ fill: "#bae6fd", fontWeight: 600 }}
                    />
                    <YAxis
                      stroke="#bae6fd"
                      tick={{ fill: "#bae6fd", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f2027",
                        color: "#bae6fd",
                        border: "1px solid #22d3ee",
                      }}
                    />
                  </LineChart>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card className="bg-gradient-to-b from-cyan-950/80 to-cyan-900/80 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-cyan-100 font-bold">
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-cyan-200/90 font-medium">
                Active Students (Last 30 Days):{" "}
                <span className="font-bold text-cyan-100">
                  {activeStudents > 0 ? (
                    activeStudents
                  ) : (
                    <span className="text-cyan-400">No active students</span>
                  )}
                </span>
              </p>
              <div className="overflow-x-auto">
                {progressDistributionData.length === 0 ? (
                  <div className="text-cyan-400 text-center py-12 text-lg font-medium">
                    No engagement data yet
                  </div>
                ) : (
                  <PieChart
                    width={400}
                    height={300}
                    style={{ background: "transparent" }}
                  >
                    <Pie
                      data={progressDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#22d3ee"
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
                    <Tooltip
                      contentStyle={{
                        background: "#0f2027",
                        color: "#bae6fd",
                        border: "1px solid #22d3ee",
                      }}
                    />
                  </PieChart>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card className="bg-gradient-to-b from-cyan-950/80 to-cyan-900/80 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-cyan-100 font-bold">
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                {revenueByCourseData.every((d) => d.revenue === 0) ? (
                  <div className="text-cyan-400 text-center py-12 text-lg font-medium">
                    No revenue data yet
                  </div>
                ) : (
                  <BarChart
                    width={600}
                    height={300}
                    data={revenueByCourseData}
                    style={{ background: "transparent" }}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#bae6fd"
                      tick={{ fill: "#bae6fd", fontWeight: 600 }}
                    />
                    <YAxis
                      stroke="#bae6fd"
                      tick={{ fill: "#bae6fd", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f2027",
                        color: "#bae6fd",
                        border: "1px solid #22d3ee",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#22d3ee" />
                  </BarChart>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

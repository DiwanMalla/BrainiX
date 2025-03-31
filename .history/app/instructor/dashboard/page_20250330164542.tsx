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
import CreateNewCourseDialog from "../courses/add/page";
import {
  BookOpen,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
  const { user, isLoaded } = useUser(); // Use isLoaded to check if user data is ready
  const instructorId = user?.id || "";
  const router = useRouter();

  const [instructor, setInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...courseData, instructorId }),
      });
      if (response.ok) {
        const newCourse = await response.json();
        setInstructorCourses((prev) => [...prev, newCourse]);
        setStats((prev) => ({
          ...prev,
          totalCourses: prev.totalCourses + 1,
        }));
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setError("Failed to create course. Please try again.");
    }
  };

  const handleEditCourse = (courseId) => {
    // Placeholder for editing course; replace with actual route or modal logic
    router.push(`/instructor/courses/${courseId}/edit`);
  };

  useEffect(() => {
    if (!isLoaded || !instructorId) return; // Wait for user to load

    const fetchInstructorData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch instructor profile
        const profileResponse = await fetch("/api/instructor/profile");
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        if (profileData.user.role !== "INSTRUCTOR") {
          throw new Error("You are not authorized as an instructor");
        }
        setInstructor(profileData);

        // Fetch instructor courses
        const coursesResponse = await fetch("/api/instructor/courses");
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesResponse.json();
        setInstructorCourses(coursesData);

        // Fetch stats
        const statsResponse = await fetch("/api/instructor/stats");
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent enrollments
        const enrollmentsResponse = await fetch(
          "/api/instructor/courses?include=enrollments"
        );
        if (!enrollmentsResponse.ok)
          throw new Error("Failed to fetch enrollments");
        const coursesWithEnrollments = await enrollmentsResponse.json();
        const allEnrollments = coursesWithEnrollments.flatMap((course) =>
          course.enrollments.map((enrollment) => ({
            ...enrollment,
            courseTitle: course.title,
            coursePrice: course.price,
          }))
        );
        const sortedEnrollments = allEnrollments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentEnrollments(sortedEnrollments);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [instructorId, isLoaded]);

  if (!isLoaded) {
    return <div className="p-6">Loading authentication...</div>;
  }

  if (!user) {
    router.push("/sign-in"); // Redirect to sign-in if not authenticated
    return null;
  }

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!instructor) {
    return <div className="p-6">Instructor profile not found</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {instructor.user.name}
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              Create New Course
            </Button>
            <CreateNewCourseDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleCreateCourse}
            />
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
                    ${stats.totalRevenue.toLocaleString()}
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
                    {stats.totalStudents.toLocaleString()}
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
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
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
                    {stats.averageRating.toFixed(1)}
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
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-semibold truncate">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {course.totalStudents?.toLocaleString() || 0} students
                          • {course.rating?.toFixed(1) || "N/A"} rating
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between p-4 pt-0">
                        <span className="text-base font-bold text-primary">
                          ${course.price.toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(course.id)}
                        >
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
                  {recentEnrollments.length > 0 ? (
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
                          {recentEnrollments.map((enrollment) => (
                            <tr
                              key={enrollment.id}
                              className="border-b transition-colors hover:bg-muted/50"
                            >
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-muted" />
                                  <div>
                                    <p className="font-medium">
                                      {enrollment.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {enrollment.user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                {enrollment.courseTitle}
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(
                                  enrollment.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="p-4 align-middle">
                                ${enrollment.coursePrice.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-4 text-center text-muted-foreground">
                      No recent enrollments available.
                    </p>
                  )}
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
                  <p className="text-center text-muted-foreground">
                    Revenue data will be available soon.
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

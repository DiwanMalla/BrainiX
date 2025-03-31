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
  const { user, isLoaded } = useUser();
  const instructorId = user?.id || "";
  const router = useRouter();

  const [instructor, setInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState<
    {
      id: string;
      title: string;
      price: number;
      thumbnail?: string;
      totalStudents?: number;
      rating?: number;
    }[]
  >([]);
  const [recentEnrollments, setRecentEnrollments] = useState<
    {
      id: string;
      user: { name: string; email: string };
      courseTitle: string;
      coursePrice: number;
      createdAt: string;
    }[]
  >([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCourse = async (courseData: {
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
  }) => {
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
      setError("Failed to create course. Please try again.");
    }
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/edit`);
  };

  useEffect(() => {
    if (!isLoaded || !instructorId) return;

    const fetchInstructorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileResponse = await fetch("/api/instructor/profile");
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }
        const profileData = await profileResponse.json();
        if (profileData.user.role !== "INSTRUCTOR") {
          throw new Error("You are not authorized as an instructor");
        }
        setInstructor(profileData);

        const coursesResponse = await fetch("/api/instructor/courses");
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesResponse.json();
        setInstructorCourses(coursesData);

        const statsResponse = await fetch("/api/instructor/stats");
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsResponse.json();
        setStats(statsData);

        const enrollmentsResponse = await fetch(
          "/api/instructor/courses?include=enrollments"
        );
        if (!enrollmentsResponse.ok)
          throw new Error("Failed to fetch enrollments");
        const coursesWithEnrollments = await enrollmentsResponse.json();
        const allEnrollments = coursesWithEnrollments.flatMap((course) =>
          course.enrollments?.map((enrollment) => ({
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
    router.push("/sign-in");
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
                    {(stats.averageRating ?? 0).toFixed(1)}
                  </div>
                  <div className="flex items-center text-sm text-red-500">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    2%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses */}
          <Tabs defaultValue="courses">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="enrollments">Recent Enrollments</TabsTrigger>
            </TabsList>
            <TabsContent value="courses">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {instructorCourses && instructorCourses.length > 0 ? (
                  instructorCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="relative h-36 w-full">
                          <Image
                            src={course.thumbnail || "/placeholder.jpg"}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.price}</CardDescription>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No courses available yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="enrollments">
              <div className="overflow-x-auto">
                {recentEnrollments && recentEnrollments.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Student</th>
                        <th className="text-left">Course</th>
                        <th className="text-left">Price</th>
                        <th className="text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td>{enrollment.user.name}</td>
                          <td>{enrollment.courseTitle}</td>
                          <td>${enrollment.coursePrice}</td>
                          <td>
                            {new Date(
                              enrollment.createdAt
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No recent enrollments yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Mail,
  Filter,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Enrollment {
  courseTitle: string;
  enrollmentDate: string;
  progress: number;
  lastActive: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  country?: string;
  enrollments: Enrollment[];
}

interface Course {
  id: string;
  title: string;
}

export default function InstructorStudentsPage() {
  const { user, isLoaded } = useUser();
  const instructorId = user?.id || "";
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !instructorId) return;

    const fetchInstructorData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch instructor&apos;s courses
        console.log("Fetching courses for instructorId:", instructorId);
        const coursesResponse = await fetch("/api/instructor/courses");
        const coursesText = await coursesResponse.text();
        console.log("Courses response:", coursesResponse.status, coursesText);
        if (!coursesResponse.ok) {
          throw new Error(
            `Failed to fetch courses: ${coursesResponse.status} - ${coursesText}`
          );
        }
        const coursesData: Course[] = JSON.parse(coursesText);
        setInstructorCourses(coursesData);

        // Fetch students enrolled in instructor&apos;s courses
        console.log("Fetching students for instructorId:", instructorId);
        const studentsResponse = await fetch("/api/instructor/students");
        const studentsText = await studentsResponse.text();
        console.log(
          "Students response:",
          studentsResponse.status,
          studentsText
        );
        if (!studentsResponse.ok) {
          throw new Error(
            `Failed to fetch students: ${studentsResponse.status} - ${studentsText}`
          );
        }
        const studentsData: Student[] = JSON.parse(studentsText);
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching instructor data:", err);
        setError("Failed to load students and courses");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [instructorId, isLoaded]);

  // Filter students based on search query and course filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (courseFilter === "all") return matchesSearch;
    return (
      matchesSearch &&
      student.enrollments.some((enrollment) =>
        enrollment.courseTitle
          .toLowerCase()
          .includes(courseFilter.toLowerCase())
      )
    );
  });

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
      <div className="flex min-h-screen">
        <div className="flex-1 p-6">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Students</h1>
              <p className="text-muted-foreground">
                Manage and track your students&apos; progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Students
              </Button>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {instructorCourses.map((course) => (
                  <SelectItem key={course.id} value={course.title}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
            <Button variant="outline" className="md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <Card className="mt-6">
              <CardHeader className="p-4">
                <CardTitle>Student List</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Email
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Enrolled Courses
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Enrollment Date
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Progress
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Last Active
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Country
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                {student.name.charAt(0)}
                              </div>
                              <span className="font-medium">
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{student.email}</td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col gap-1">
                              {student.enrollments.map((enrollment, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-muted px-2 py-1 rounded-full inline-block"
                                >
                                  {enrollment.courseTitle}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {student.enrollments.length > 0
                              ? new Date(
                                  student.enrollments[0].enrollmentDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${
                                      student.enrollments.length > 0
                                        ? student.enrollments.reduce(
                                            (acc, e) => acc + e.progress,
                                            0
                                          ) / student.enrollments.length
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs">
                                {student.enrollments.length > 0
                                  ? Math.round(
                                      student.enrollments.reduce(
                                        (acc, e) => acc + e.progress,
                                        0
                                      ) / student.enrollments.length
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {student.enrollments.length > 0
                              ? new Date(
                                  student.enrollments.reduce((latest, e) =>
                                    new Date(e.lastActive) >
                                    new Date(latest.lastActive)
                                      ? e
                                      : latest
                                  ).lastActive
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-4 align-middle">
                            {student.country || "N/A"}
                          </td>
                          <td className="p-4 align-middle">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Progress
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Inside InstructorDashboard component (e.g., app/instructor/page.tsx)
import { useEffect, useState } from "react";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { getAllCourses } from "@/lib/course-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // For Next.js Image component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ... other imports and component setup

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user"); // Fetch from your API
        const data = await response.json();
        if (response.ok) {
          setInstructor(data);
          const allCourses = getAllCourses(); // Your local course data
          const courses =
            data.role === "admin"
              ? allCourses
              : allCourses.filter((course) =>
                  data.courses.some((c: any) => c.id === course.id)
                );
          setInstructorCourses(courses);
        } else {
          setError(data.message || "Failed to fetch instructor data");
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructor();
  }, []);

  if (isLoading)
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6 text-red-500">{error}</div>
      </div>
    );
  if (!instructor)
    return (
      <div className="flex min-h-screen">
        <InstructorSidebar />
        <div className="flex-1 p-6">No instructor data available.</div>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />
      <div className="flex-1 p-6 space-y-6">
        {/* Header and other sections omitted for brevity */}

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

          <TabsContent value="courses" className="mt-6">
            <div className="space-y-6">
              {/* Header for My Courses */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  My Courses
                </h2>
                <Button variant="default" size="sm">
                  Add New Course
                </Button>
              </div>

              {/* Courses Grid */}
              {instructorCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="overflow-hidden transition-shadow hover:shadow-lg border border-muted"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-semibold truncate">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          <span>
                            {course.students.toLocaleString()} students
                          </span>{" "}
                          • <span>{course.rating.toFixed(1)} rating</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex items-center justify-between">
                        <span className="text-base font-bold text-primary">
                          ${course.price.toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          Edit Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <p className="text-lg text-muted-foreground">
                    No courses available yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start by adding a new course!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Other TabsContent (students, revenue) omitted for brevity */}
        </Tabs>
      </div>
    </div>
  );
}

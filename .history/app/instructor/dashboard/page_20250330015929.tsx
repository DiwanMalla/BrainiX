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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog components
import { getAllCourses } from "@/lib/course-data";
import {
  BookOpen,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Image from "next/image";

export default function InstructorDashboard() {
  interface Instructor {
    name: string;
    role: string;
    students?: number;
    totalRevenue?: number;
    courses: { id: string }[];
  }

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  interface Course {
    id: string;
    title: string;
    image?: string;
    students: number;
    rating: number;
    price: number;
  }

  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false); // Track dialog state

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
                      (courseData: { id: string }) =>
                        courseData.id === course.id
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

            {/* Button to trigger the dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Course</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Course</DialogTitle>
                  <DialogDescription>
                    Fill in the course details below to create a new course.
                  </DialogDescription>
                </DialogHeader>

                {/* Add your form here to create a course */}
                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">
                        Course Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter course title"
                        className="w-full p-2 mt-1 border border-muted rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">
                        Course Description
                      </label>
                      <textarea
                        placeholder="Enter course description"
                        className="w-full p-2 mt-1 border border-muted rounded"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">
                        Price
                      </label>
                      <input
                        type="number"
                        placeholder="Enter course price"
                        className="w-full p-2 mt-1 border border-muted rounded"
                      />
                    </div>
                  </div>
                </form>

                <DialogFooter>
                  <Button
                    onClick={() => {
                      // Handle course creation logic here
                      console.log("Course created");
                      setDialogOpen(false);
                    }}
                  >
                    Create Course
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <TabsContent value="courses">
              {/* Add your course display code here */}
            </TabsContent>
            <TabsContent value="students">
              {/* Add your student display code here */}
            </TabsContent>
            <TabsContent value="revenue">
              {/* Add your revenue display code here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

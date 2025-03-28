"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InstructorSidebar } from "@/components/instructor/sidebar";
// import { getCurrentInstructor, type Instructor } from "@/lib/instructor-auth";

import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Star,
  Clock,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useClerk, UserButton } from "@clerk/nextjs";

export default function InstructorCoursesPage() {
  // const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [instructorCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  // useEffect(() => {
  //   const currentInstructor = getCurrentInstructor();
  //   setInstructor(currentInstructor);

  //   if (currentInstructor) {
  //     // Get instructor's courses
  //     const allCourses = getAllCourses();
  //     const courses =
  //       currentInstructor.role === "admin"
  //         ? allCourses
  //         : allCourses.filter((course) =>
  //             currentInstructor.courses.includes(course.id)
  //           );

  //     setInstructorCourses(courses);
  //   }
  // }, []);

  // if (!instructor) {
  //   return null;
  // }

  // Filter courses based on search query and active tab
  const filteredCourses = instructorCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "published")
      return matchesSearch && course.published !== false;
    if (activeTab === "draft")
      return matchesSearch && course.published === false;

    return matchesSearch;
  });

  const handleDeleteCourse = (courseId: string) => {
    toast({
      title: "Course deleted",
      description: "The course has been deleted successfully",
    });
  };
  const user = useClerk();
  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <UserButton afterSignOutUrl="/" />
              <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
              <p className="text-muted-foreground">
                Manage your courses and create new content
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                        {course.published === false && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2"
                          >
                            Draft
                          </Badge>
                        )}
                        {course.bestseller && (
                          <Badge className="absolute top-2 left-2">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {course.shortDescription ||
                            course.description.substring(0, 60) + "..."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-amber-500" />
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <span className="font-bold">
                          ${course.price.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="h-4 w-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No courses match your search criteria"
                      : "You haven't created any courses yet"}
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

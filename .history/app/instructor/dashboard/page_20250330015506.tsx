import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal"; // Assuming you have a Modal component
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

// Assuming the getAllCourses function fetches all courses
import { getAllCourses } from "@/lib/course-data";

export default function InstructorDashboard() {
  interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  }

  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      // Fetch the courses from your API
      const courses = await getAllCourses();
      setInstructorCourses(courses);
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    // Logic to create a new course
    const newCourseData = {
      ...newCourse,
      price: parseFloat(newCourse.price), // Ensure price is a number
    };

    // Send this data to your API or handle it as needed
    // Example: Add to state, make an API call, etc.
    setInstructorCourses([...instructorCourses, newCourseData]);

    // Close the modal after submission
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Instructor Dashboard
              </h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              Create New Course
            </Button>
          </div>

          {/* Course List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructorCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4 pt-0">
                  <span className="text-base font-bold text-primary">
                    ${course.price.toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm">
                    Edit Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for creating new course */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
          <div className="space-y-4">
            <Input
              label="Course Title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
            <Textarea
              label="Course Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
            <Input
              label="Price"
              type="number"
              value={newCourse.price}
              onChange={(e) =>
                setNewCourse({ ...newCourse, price: e.target.value })
              }
            />
            <Input
              label="Image URL"
              value={newCourse.image}
              onChange={(e) =>
                setNewCourse({ ...newCourse, image: e.target.value })
              }
            />
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

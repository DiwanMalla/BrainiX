"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseBySlug, Course } from "@/lib/course-data";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchedCourse = getCourseBySlug(params.slug);
    if (fetchedCourse) {
      setCourse(fetchedCourse);
      setFormData(fetchedCourse);
    }
    setIsLoading(false);
  }, [params.slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/courses/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Course updated successfully!");
        router.push("/instructor/courses");
      } else {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <InstructorSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-cyan-400 text-lg animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <InstructorSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-red-400 text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto bg-gray-800/80 border-none shadow-lg shadow-cyan-500/20">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-3xl font-bold text-cyan-400 tracking-wide">
              Edit Course: {course.title}
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Update your course details below
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-300"
                >
                  Course Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="shortDescription"
                  className="text-sm font-medium text-gray-300"
                >
                  Short Description
                </Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 min-h-[100px] transition-all duration-300"
                  placeholder="Briefly describe your course"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-300"
                >
                  Full Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 min-h-[150px] transition-all duration-300"
                  placeholder="Provide detailed course information"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-300"
                  >
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                    placeholder="e.g., 89.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="discount"
                    className="text-sm font-medium text-gray-300"
                  >
                    Discount ($)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount || ""}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/instructor/courses")}
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

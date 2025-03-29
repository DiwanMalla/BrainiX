"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseBySlug, Course } from "@/lib/course-data";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      <div className="flex min-h-screen">
        <div className="flex-1 p-6">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6">Course not found</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Course: {course.title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount (optional)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              step="0.01"
              value={formData.discount || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Save Changes</Button>
            <Button
              variant="outline"
              onClick={() => router.push("/instructor/courses")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCourseBySlug, Course } from "@/lib/course-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function EditCoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const router = useRouter();

  useEffect(() => {
    if (typeof params.slug === "string") {
      const fetchedCourse = getCourseBySlug(params.slug);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        setFormData(fetchedCourse);
      }
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
      const response = await fetch(`/api/instructor/courses/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);
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
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-destructive text-lg">Course not found</p>
        </div>
      </div>
    );
  }
  console.log(formData);
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Edit Course: {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update your course details below
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Course Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="shortDescription"
                  className="text-sm font-medium"
                >
                  Short Description
                </Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                  placeholder="Briefly describe your course"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Full Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  className="min-h-[150px]"
                  placeholder="Provide detailed course information"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
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
                    placeholder="e.g., 89.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-sm font-medium">
                    Discount ($)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount || ""}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit">Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/instructor/courses")}
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

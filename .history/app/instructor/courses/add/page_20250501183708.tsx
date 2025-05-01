// app/instructor/courses/add/page.tsx
"use client";

import React, { useState } from "react";
import CreateNewCourseDialog, {
  CourseFormData,
} from "@/components/CreateNewCourseDialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddCoursePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleClose = () => {
    setIsDialogOpen(false);
    router.push("/instructor/courses");
  };

  const handleSubmit = async (formData: CourseFormData) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      toast({
        title: "Success",
        description: "Course created successfully!",
      });
      router.push("/instructor/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
      <CreateNewCourseDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

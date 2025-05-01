// components/CreateNewCourseDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string;
  previewVideo: string;
  level: string;
  status: string;
  featured: boolean;
  bestseller: boolean;
  published: boolean;
  language: string;
  subtitlesLanguages: string[];
  duration: number;
  totalLessons: number;
  totalModules: number;
  requirements: string[];
  learningObjectives: string[];
  targetAudience: string[];
  tags: string[];
  categoryId: string;
}

interface CreateNewCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CourseFormData) => void;
}

const CreateNewCourseDialog: React.FC<CreateNewCourseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: 0,
    discountPrice: null,
    thumbnail: "",
    previewVideo: "",
    level: "BEGINNER",
    status: "DRAFT",
    featured: false,
    bestseller: false,
    published: false,
    language: "English",
    subtitlesLanguages: [],
    duration: 0,
    totalLessons: 0,
    totalModules: 0,
    requirements: [],
    learningObjectives: [],
    targetAudience: [],
    tags: [],
    categoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleArrayChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., UX/UI Design Masterclass"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., ux-ui-design-masterclass"
                required
              />
            </div>
            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="e.g., Learn to create beautiful, functional designs..."
              />
            </div>
            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., This masterclass covers everything you need to know..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="discountPrice">Discount Price ($)</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                value={formData.discountPrice ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="e.g., https://images.unsplash.com/..."
              />
            </div>
            <div>
              <Label htmlFor="previewVideo">Preview Video URL</Label>
              <Input
                id="previewVideo"
                name="previewVideo"
                value={formData.previewVideo}
                onChange={handleChange}
                placeholder="e.g., https://youtube.com/..."
              />
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level</Label>
              <Select
                name="level"
                value={formData.level}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g., English"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalLessons">Total Lessons</Label>
              <Input
                id="totalLessons"
                name="totalLessons"
                type="number"
                value={formData.totalLessons}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalModules">Total Modules</Label>
              <Input
                id="totalModules"
                name="totalModules"
                type="number"
                value={formData.totalModules}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Array Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subtitlesLanguages">
                Subtitles Languages (comma-separated)
              </Label>
              <Input
                id="subtitlesLanguages"
                name="subtitlesLanguages"
                value={formData.subtitlesLanguages.join(", ")}
                onChange={(e) =>
                  handleArrayChange("subtitlesLanguages", e.target.value)
                }
                placeholder="e.g., English, Spanish"
              />
            </div>
            <div>
              <Label htmlFor="requirements">
                Requirements (comma-separated)
              </Label>
              <Input
                id="requirements"
                name="requirements"
                value={formData.requirements.join(", ")}
                onChange={(e) =>
                  handleArrayChange("requirements", e.target.value)
                }
                placeholder="e.g., Basic design knowledge"
              />
            </div>
            <div>
              <Label htmlFor="learningObjectives">
                Learning Objectives (comma-separated)
              </Label>
              <Input
                id="learningObjectives"
                name="learningObjectives"
                value={formData.learningObjectives.join(", ")}
                onChange={(e) =>
                  handleArrayChange("learningObjectives", e.target.value)
                }
                placeholder="e.g., Conduct user research"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">
                Target Audience (comma-separated)
              </Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience.join(", ")}
                onChange={(e) =>
                  handleArrayChange("targetAudience", e.target.value)
                }
                placeholder="e.g., Beginners in design"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
                placeholder="e.g., UX, UI, Design"
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Input
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                placeholder="e.g., Category ID"
                required
              />
            </div>
          </div>

          {/* Status and Flags */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="bestseller"
                name="bestseller"
                type="checkbox"
                checked={formData.bestseller}
                onChange={handleChange}
              />
              <Label htmlFor="bestseller">Bestseller</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewCourseDialog;

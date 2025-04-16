"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  Video,
  FileText,
  CheckCircle2,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Course, Module, Lesson } from "@/types/globals";

// Define interfaces for module and lesson data
interface LessonData {
  id: string;
  title: string;
  description: string | null;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
  duration: number;
  isNew?: boolean;
  isEditing?: boolean;
}

interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  lessons: LessonData[];
  isExpanded?: boolean;
  isNew?: boolean;
  isEditing?: boolean;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [showModuleEditor, setShowModuleEditor] = useState(false);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isSavingModules, setIsSavingModules] = useState(false);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{
    moduleId: string;
    lessonId: string;
  } | null>(null);
  const dragControls = useDragControls();

  // Fetch course data
  useEffect(() => {
    async function fetchCourse() {
      if (typeof params.slug === "string") {
        try {
          const response = await fetch(
            `/api/instructor/courses/${params.slug}`
          );
          if (response.ok) {
            const data = await response.json();
            setCourse(data);
            setFormData({
              title: data.title,
              shortDescription: data.shortDescription,
              description: data.description,
              price: data.price,
              discountPrice: data.discountPrice || 0,
            });
            // Initialize modules and lessons
            setModules(
              data.modules.map((module: Module) => ({
                id: module.id,
                title: module.title,
                description: module.description || "",
                isExpanded: true,
                lessons: module.lessons.map((lesson: Lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
                  description: lesson.description || "",
                  type: lesson.type,
                  duration: lesson.duration,
                })),
              }))
            );
          } else {
            setCourse(null);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          setCourse(null);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchCourse();
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

      if (response.ok) {
        alert("Course updated successfully!");
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const isSubmit = formData.get("submit");
        if (isSubmit) {
          router.push(`/instructor/courses/${params.slug}`);
        } else {
          router.push("/instructor/courses");
        }
      } else {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  const addModule = () => {
    const newModule: ModuleData = {
      id: `module-${modules.length + 1}-${Date.now()}`,
      title: `New Module`,
      description: "Module description",
      lessons: [],
      isExpanded: true,
      isNew: true,
      isEditing: true,
    };
    setModules([...modules, newModule]);
    setTimeout(() => {
      document
        .getElementById(newModule.id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter((module) => module.id !== moduleId));
    toast({
      title: "Module deleted",
      description: "The module has been removed from your course",
    });
  };

  const toggleModuleExpand = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module
      )
    );
  };

  const updateModule = (moduleId: string, data: Partial<ModuleData>) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, ...data, isNew: false } : module
      )
    );
  };

  const addLesson = (moduleId: string) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        const newLesson: LessonData = {
          id: `lesson-${moduleId}-${module.lessons.length + 1}-${Date.now()}`,
          title: `New Lesson`,
          description: "",
          type: "VIDEO",
          duration: 0,
          isNew: true,
          isEditing: true,
        };
        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }
      return module;
    });
    setModules(updatedModules);
    const moduleIndex = modules.findIndex((m) => m.id === moduleId);
    if (moduleIndex !== -1) {
      const lessonId = `lesson-${moduleId}-${
        modules[moduleIndex].lessons.length + 1
      }-${Date.now()}`;
      setTimeout(() => {
        document
          .getElementById(lessonId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return module;
    });
    setModules(updatedModules);
    toast({
      title: "Lesson deleted",
      description: "The lesson has been removed from the module",
    });
  };

  const updateLesson = (
    moduleId: string,
    lessonId: string,
    data: Partial<LessonData>
  ) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, ...data, isNew: false }
              : lesson
          ),
        };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const reorderModules = (newOrder: ModuleData[]) => {
    setModules(newOrder);
  };

  const reorderLessons = (moduleId: string, newOrder: LessonData[]) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, lessons: newOrder } : module
      )
    );
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "QUIZ":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "TEXT":
      case "ASSIGNMENT":
      case "LIVE_SESSION":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const handleSaveModules = async () => {
    setIsSavingModules(true);
    try {
      const response = await fetch(`/api/instructor/courses/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          modules: modules.map((module, index) => ({
            id: module.id,
            title: module.title,
            description: module.description,
            position: index,
            lessons: module.lessons.map((lesson, lessonIndex) => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              type: lesson.type,
              duration: lesson.duration,
              position: lessonIndex,
            })),
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "Modules saved",
          description:
            "Your course modules and lessons have been saved successfully",
        });
        setShowModuleEditor(false);
      } else {
        throw new Error("Failed to update modules");
      }
    } catch (error) {
      console.error("Error updating modules:", error);
      toast({
        title: "Error",
        description: "Failed to save modules",
        variant: "destructive",
      });
    } finally {
      setIsSavingModules(false);
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
                  <Label
                    htmlFor="discountPrice"
                    className="text-sm font-medium"
                  >
                    Discount ($)
                  </Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountPrice || ""}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button name="submit" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModuleEditor(true)}
                >
                  Edit Modules & Lessons
                </Button>
                <Button
                  name="cancel"
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

      {/* Module Editor Dialog */}
      <Dialog open={showModuleEditor} onOpenChange={setShowModuleEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Modules & Lessons</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Course Modules
                <Badge variant="outline">{modules.length}</Badge>
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={addModule}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Module
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new module to your course</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <ScrollArea className="h-[60vh]">
              <Reorder.Group
                axis="y"
                values={modules}
                onReorder={reorderModules}
                className="space-y-4"
              >
                <AnimatePresence initial={false}>
                  {modules.map((module) => (
                    <Reorder.Item
                      key={module.id}
                      value={module}
                      id={module.id}
                      initial={module.isNew ? { opacity: 0, height: 0 } : false}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="focus-visible:outline-none"
                      dragListener={false}
                    >
                      <Card
                        className={`overflow-hidden border ${
                          module.isNew ? "border-primary" : ""
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                className="cursor-move touch-none flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                                onPointerDown={(e) => {
                                  setDraggedModule(module.id);
                                  // @ts-ignore - framer-motion types issue
                                  dragControls.start(e);
                                }}
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>

                              {module.isEditing ? (
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={module.title}
                                    onChange={(e) =>
                                      updateModule(module.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="font-medium border bg-background h-9"
                                    placeholder="Module title"
                                    autoFocus
                                  />
                                  <Input
                                    value={module.description || ""}
                                    onChange={(e) =>
                                      updateModule(module.id, {
                                        description: e.target.value,
                                      })
                                    }
                                    className="text-sm text-muted-foreground border bg-background h-9"
                                    placeholder="Module description"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="flex-1"
                                  onClick={() =>
                                    updateModule(module.id, { isEditing: true })
                                  }
                                >
                                  <h3 className="font-medium text-base">
                                    {module.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {module.description || "No description"}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {module.isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updateModule(module.id, {
                                      isEditing: false,
                                    })
                                  }
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Save</span>
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updateModule(module.id, { isEditing: true })
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleModuleExpand(module.id)}
                              >
                                {module.isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {module.isExpanded ? "Collapse" : "Expand"}
                                </span>
                              </Button>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-4">
                                    <h4 className="font-medium">
                                      Delete Module
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Are you sure you want to delete this
                                      module and all its lessons? This action
                                      cannot be undone.
                                    </p>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" size="sm">
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteModule(module.id)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {module.isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-4 space-y-2">
                                  <Reorder.Group
                                    axis="y"
                                    values={module.lessons}
                                    onReorder={(newOrder) =>
                                      reorderLessons(module.id, newOrder)
                                    }
                                    className="space-y-2"
                                  >
                                    <AnimatePresence initial={false}>
                                      {module.lessons.map((lesson) => (
                                        <Reorder.Item
                                          key={lesson.id}
                                          value={lesson}
                                          id={lesson.id}
                                          initial={
                                            lesson.isNew
                                              ? { opacity: 0, height: 0 }
                                              : false
                                          }
                                          animate={{
                                            opacity: 1,
                                            height: "auto",
                                          }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="focus-visible:outline-none"
                                        >
                                          <motion.div
                                            className={`flex items-center gap-2 p-3 rounded-md border ${
                                              lesson.isNew
                                                ? "border-primary"
                                                : "border-transparent"
                                            } hover:bg-muted/50 transition-colors`}
                                            whileHover={{ scale: 1.005 }}
                                            whileTap={{ scale: 0.995 }}
                                          >
                                            <div
                                              className="cursor-move touch-none flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                                              onPointerDown={(e) => {
                                                setDraggedLesson({
                                                  moduleId: module.id,
                                                  lessonId: lesson.id,
                                                });
                                                // @ts-ignore - framer-motion types issue
                                                dragControls.start(e);
                                              }}
                                            >
                                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            </div>

                                            {getLessonTypeIcon(lesson.type)}

                                            <div className="flex-1 space-y-2">
                                              {lesson.isEditing ? (
                                                <>
                                                  <Input
                                                    value={lesson.title}
                                                    onChange={(e) =>
                                                      updateLesson(
                                                        module.id,
                                                        lesson.id,
                                                        {
                                                          title: e.target.value,
                                                        }
                                                      )
                                                    }
                                                    className="border bg-background h-9"
                                                    placeholder="Lesson title"
                                                    autoFocus
                                                  />
                                                  <Input
                                                    value={
                                                      lesson.description || ""
                                                    }
                                                    onChange={(e) =>
                                                      updateLesson(
                                                        module.id,
                                                        lesson.id,
                                                        {
                                                          description:
                                                            e.target.value,
                                                        }
                                                      )
                                                    }
                                                    className="border bg-background h-9"
                                                    placeholder="Lesson description"
                                                  />
                                                </>
                                              ) : (
                                                <div
                                                  className="text-sm font-medium cursor-pointer"
                                                  onClick={() =>
                                                    updateLesson(
                                                      module.id,
                                                      lesson.id,
                                                      { isEditing: true }
                                                    )
                                                  }
                                                >
                                                  <div>{lesson.title}</div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {lesson.description ||
                                                      "No description"}
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Select
                                                value={lesson.type}
                                                onValueChange={(value) =>
                                                  updateLesson(
                                                    module.id,
                                                    lesson.id,
                                                    {
                                                      type: value as
                                                        | "VIDEO"
                                                        | "TEXT"
                                                        | "QUIZ"
                                                        | "ASSIGNMENT"
                                                        | "LIVE_SESSION",
                                                    }
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="h-8 w-[120px]">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="VIDEO">
                                                    Video
                                                  </SelectItem>
                                                  <SelectItem value="TEXT">
                                                    Text
                                                  </SelectItem>
                                                  <SelectItem value="QUIZ">
                                                    Quiz
                                                  </SelectItem>
                                                  <SelectItem value="ASSIGNMENT">
                                                    Assignment
                                                  </SelectItem>
                                                  <SelectItem value="LIVE_SESSION">
                                                    Live Session
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>

                                              <Input
                                                value={
                                                  Math.floor(
                                                    lesson.duration / 60
                                                  ) +
                                                  ":" +
                                                  (lesson.duration % 60)
                                                    .toString()
                                                    .padStart(2, "0")
                                                }
                                                onChange={(e) => {
                                                  const [minutes, seconds] =
                                                    e.target.value
                                                      .split(":")
                                                      .map(Number);
                                                  if (
                                                    !isNaN(minutes) &&
                                                    !isNaN(seconds)
                                                  ) {
                                                    updateLesson(
                                                      module.id,
                                                      lesson.id,
                                                      {
                                                        duration:
                                                          minutes * 60 +
                                                          seconds,
                                                      }
                                                    );
                                                  }
                                                }}
                                                className="w-20 h-8"
                                                placeholder="MM:SS"
                                              />

                                              {lesson.isEditing ? (
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() =>
                                                    updateLesson(
                                                      module.id,
                                                      lesson.id,
                                                      { isEditing: false }
                                                    )
                                                  }
                                                >
                                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                  <span className="sr-only">
                                                    Save
                                                  </span>
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() =>
                                                    updateLesson(
                                                      module.id,
                                                      lesson.id,
                                                      { isEditing: true }
                                                    )
                                                  }
                                                >
                                                  <Pencil className="h-4 w-4" />
                                                  <span className="sr-only">
                                                    Edit
                                                  </span>
                                                </Button>
                                              )}

                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                  deleteLesson(
                                                    module.id,
                                                    lesson.id
                                                  )
                                                }
                                              >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">
                                                  Delete
                                                </span>
                                              </Button>
                                            </div>
                                          </motion.div>
                                        </Reorder.Item>
                                      ))}
                                    </AnimatePresence>
                                  </Reorder.Group>

                                  <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      className="w-full mt-2 border border-dashed"
                                      onClick={() => addLesson(module.id)}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add Lesson
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModuleEditor(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveModules} disabled={isSavingModules}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingModules ? "Saving..." : "Save Modules"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

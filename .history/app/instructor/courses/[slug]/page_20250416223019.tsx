"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast, useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import {
  Save,
  Plus,
  ImageIcon,
  DollarSign,
  Tag,
  Upload,
  ArrowLeft,
  Eye,
  Trash2,
  GripVertical,
  FileText,
  Video,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course, Module, Lesson } from "@/types/globals";

// Define interfaces based on Prisma schema
interface LessonData {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
  duration: number; // Duration in seconds
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{
    moduleId: string;
    lessonId: string;
  } | null>(null);
  const dragControls = useDragControls();
  const { toast } = useToast();
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
              level: data.level,
              published: data.published,
            });
            // Map modules and lessons to include UI-specific properties
            setModules(
              data.modules.map((module: Module) => ({
                id: module.id,
                title: module.title,
                description: module.description || "",
                isExpanded: true,
                lessons: module.lessons.map((lesson: Lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
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

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (saveStatus === "idle") {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [modules, formData, saveStatus]);

  const handleAutoSave = async () => {
    setSaveStatus("saving");
    await handleSave(true);
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true);
    setSaveStatus("saving");

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
              type: lesson.type,
              duration: lesson.duration,
              position: lessonIndex,
            })),
          })),
        }),
      });

      if (response.ok) {
        if (!isAutoSave) {
          toast({
            title: "Course saved",
            description: "Your course has been saved successfully",
          });
        }
      } else {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setSaveStatus("error");
      if (!isAutoSave) {
        toast({
          title: "Error",
          description: "Failed to save course",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
      if (!isAutoSave) {
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
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

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1,
              ease: "linear",
            }}
            className="h-4 w-4 text-muted-foreground"
          >
            <Clock className="h-4 w-4" />
          </motion.div>
        );
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
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
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/instructor/courses")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                Edit Course: {course.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus !== "idle" && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
                  {getSaveStatusIcon()}
                  <span>
                    {saveStatus === "saving"
                      ? "Saving..."
                      : saveStatus === "success"
                      ? "Saved"
                      : "Error saving"}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <div className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeTab === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="Enter course title"
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">
                        Short Description
                      </Label>
                      <Textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription || ""}
                        onChange={handleChange}
                        placeholder="Briefly describe your course"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        placeholder="Provide detailed course information"
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

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

                <ScrollArea className="h-[calc(100vh-280px)]">
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
                          initial={
                            module.isNew ? { opacity: 0, height: 0 } : false
                          }
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
                                        updateModule(module.id, {
                                          isEditing: true,
                                        })
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
                                        updateModule(module.id, {
                                          isEditing: true,
                                        })
                                      }
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      toggleModuleExpand(module.id)
                                    }
                                  >
                                    {module.isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      {module.isExpanded
                                        ? "Collapse"
                                        : "Expand"}
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
                                          module and all its lessons? This
                                          action cannot be undone.
                                        </p>
                                        <div className="flex justify-end gap-2">
                                          <Button variant="outline" size="sm">
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                              deleteModule(module.id)
                                            }
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

                                                <div className="flex-1">
                                                  {lesson.isEditing ? (
                                                    <Input
                                                      value={lesson.title}
                                                      onChange={(e) =>
                                                        updateLesson(
                                                          module.id,
                                                          lesson.id,
                                                          {
                                                            title:
                                                              e.target.value,
                                                          }
                                                        )
                                                      }
                                                      className="border bg-background h-9"
                                                      placeholder="Lesson title"
                                                      autoFocus
                                                    />
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
                                                      {lesson.title}
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
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          name="level"
                          value={formData.level || "BEGINNER"}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, level: value }))
                          }
                        >
                          <SelectTrigger id="level">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                            <SelectItem value="ALL_LEVELS">
                              All Levels
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Course Thumbnail</Label>
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-4">
                        <div className="aspect-video w-full max-w-md bg-muted/50 rounded-md flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="published">Published</Label>
                          <p className="text-sm text-muted-foreground">
                            Make this course available to students
                          </p>
                        </div>
                        <Switch
                          id="published"
                          checked={formData.published || false}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("published", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "pricing" && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price || ""}
                          onChange={handleChange}
                          className="pl-8"
                          placeholder="e.g., 89.99"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountPrice">Discount ($)</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="discountPrice"
                          name="discountPrice"
                          type="number"
                          step="0.01"
                          value={formData.discountPrice || ""}
                          onChange={handleChange}
                          className="pl-8"
                          placeholder="e.g., 20"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Set to 0 for no discount
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Final Price:</span>
                        <span className="text-xl font-bold">
                          ${formData.price || "0.00"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

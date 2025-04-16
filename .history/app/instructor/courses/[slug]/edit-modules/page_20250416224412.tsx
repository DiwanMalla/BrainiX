"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowLeft,
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
import { useToast } from "@/hooks/use-toast";
import { Course, Module, Lesson } from "@/types/globals";

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

export default function EditModulesPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const dragControls = useDragControls();
  const { toast } = useToast();
  useEffect(() => {
    async function fetchCourse() {
      if (typeof params.slug !== "string") {
        setCourse(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/instructor/courses/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
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

    fetchCourse();
  }, [params.slug]);

  const addModule = () => {
    const newModule: ModuleData = {
      id: `module-${modules.length + 1}-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: "",
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
          title: `Lesson ${module.lessons.length + 1}`,
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
        return <Video className="h-5 w-5 text-blue-500" />;
      case "QUIZ":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "TEXT":
      case "ASSIGNMENT":
      case "LIVE_SESSION":
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/instructor/courses/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: course?.title,
          shortDescription: course?.shortDescription,
          description: course?.description,
          price: course?.price,
          discountPrice: course?.discountPrice,
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
        router.push(`/instructor/courses/${params.slug}/edit`);
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
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-muted-foreground text-lg animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-destructive text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(`/instructor/courses/${params.slug}/edit`)
                }
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {course.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.shortDescription || "No description available"}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-5 w-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Curriculum
            <Badge variant="secondary" className="text-sm">
              {modules.length} {modules.length === 1 ? "Module" : "Modules"}
            </Badge>
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={addModule}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Module
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new module to your course</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
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
                  initial={module.isNew ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="focus-visible:outline-none"
                  dragListener={false}
                >
                  <Card
                    className={`overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      module.isNew
                        ? "border-primary/50 bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="p-6 bg-gradient-to-r from-muted/50 to-background flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="cursor-move touch-none flex items-center justify-center h-10 w-10 rounded-full bg-background/50 hover:bg-background transition-colors"
                            onPointerDown={(e) => dragControls.start(e)}
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {module.isEditing ? (
                            <div className="flex-1 space-y-3">
                              <Input
                                value={module.title}
                                onChange={(e) =>
                                  updateModule(module.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="text-lg font-semibold border bg-background h-10"
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
                                className="text-sm text-muted-foreground border bg-background h-10"
                                placeholder="Module description (optional)"
                              />
                            </div>
                          ) : (
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() =>
                                updateModule(module.id, { isEditing: true })
                              }
                            >
                              <h3 className="text-lg font-semibold text-foreground">
                                {module.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {module.description || "No description"}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {module.isEditing ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateModule(module.id, { isEditing: false })
                              }
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
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
                              <Pencil className="h-5 w-5 text-muted-foreground" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleModuleExpand(module.id)}
                          >
                            {module.isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {module.isExpanded ? "Collapse" : "Expand"}
                            </span>
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <h4 className="font-medium text-foreground">
                                  Delete Module
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this module
                                  and all its lessons? This action cannot be
                                  undone.
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
                            transition={{ duration: 0.3 }}
                            className="p-6 pt-4"
                          >
                            <Reorder.Group
                              axis="y"
                              values={module.lessons}
                              onReorder={(newOrder) =>
                                reorderLessons(module.id, newOrder)
                              }
                              className="space-y-3"
                            >
                              <AnimatePresence initial={false}>
                                {module.lessons.map((lesson) => (
                                  <Reorder.Item
                                    key={lesson.id}
                                    value={lesson}
                                    id={lesson.id}
                                    initial={
                                      lesson.isNew
                                        ? { opacity: 0, y: 10 }
                                        : false
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="focus-visible:outline-none"
                                    dragListener={false}
                                  >
                                    <motion.div
                                      className={`flex items-center gap-4 p-4 rounded-lg border bg-background/50 hover:bg-background transition-colors shadow-sm ${
                                        lesson.isNew
                                          ? "border-primary/50 bg-primary/10"
                                          : "border-border"
                                      }`}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                    >
                                      <div
                                        className="cursor-move touch-none flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/50 transition-colors"
                                        onPointerDown={(e) =>
                                          dragControls.start(e)
                                        }
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-shrink-0">
                                        {getLessonTypeIcon(lesson.type)}
                                      </div>
                                      <div className="flex-1 space-y-2">
                                        {lesson.isEditing ? (
                                          <>
                                            <Input
                                              value={lesson.title}
                                              onChange={(e) =>
                                                updateLesson(
                                                  module.id,
                                                  lesson.id,
                                                  { title: e.target.value }
                                                )
                                              }
                                              className="text-base font-medium border bg-background h-9"
                                              placeholder="Lesson title"
                                              autoFocus
                                            />
                                            <Input
                                              value={lesson.description || ""}
                                              onChange={(e) =>
                                                updateLesson(
                                                  module.id,
                                                  lesson.id,
                                                  {
                                                    description: e.target.value,
                                                  }
                                                )
                                              }
                                              className="text-sm text-muted-foreground border bg-background h-9"
                                              placeholder="Lesson description (optional)"
                                            />
                                          </>
                                        ) : (
                                          <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                              updateLesson(
                                                module.id,
                                                lesson.id,
                                                { isEditing: true }
                                              )
                                            }
                                          >
                                            <div className="text-base font-medium text-foreground">
                                              {lesson.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
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
                                            updateLesson(module.id, lesson.id, {
                                              type: value as
                                                | "VIDEO"
                                                | "TEXT"
                                                | "QUIZ"
                                                | "ASSIGNMENT"
                                                | "LIVE_SESSION",
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-9 w-32">
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
                                            Math.floor(lesson.duration / 60) +
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
                                                    minutes * 60 + seconds,
                                                }
                                              );
                                            }
                                          }}
                                          className="w-20 h-9 text-sm"
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
                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">
                                              Edit
                                            </span>
                                          </Button>
                                        )}
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                              <span className="sr-only">
                                                Delete
                                              </span>
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80">
                                            <div className="space-y-4">
                                              <h4 className="font-medium text-foreground">
                                                Delete Lesson
                                              </h4>
                                              <p className="text-sm text-muted-foreground">
                                                Are you sure you want to delete
                                                this lesson? This action cannot
                                                be undone.
                                              </p>
                                              <div className="flex justify-end gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() =>
                                                    deleteLesson(
                                                      module.id,
                                                      lesson.id
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </Button>
                                              </div>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </motion.div>
                                  </Reorder.Item>
                                ))}
                              </AnimatePresence>
                            </Reorder.Group>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-4"
                            >
                              <Button
                                variant="outline"
                                className="w-full border-dashed text-primary hover:bg-primary/10"
                                onClick={() => addLesson(module.id)}
                                disabled={isSaving}
                              >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Lesson
                              </Button>
                            </motion.div>
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
      </main>
    </div>
  );
}

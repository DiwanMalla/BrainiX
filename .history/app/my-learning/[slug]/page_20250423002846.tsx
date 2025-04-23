"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseContent } from "@/components/course/CourseContent";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LessonNotes } from "@/components/course/LessonNotes";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  duration: number;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
  isPreview: boolean;
  progress: {
    completed: boolean;
    watchedSeconds: number;
    lastPosition: number;
    notes: string | null;
  };
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  instructor: { name: string };
  modules: Module[];
}

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useClerk();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [showNotes, setShowNotes] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !userId || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this course.",
        variant: "destructive",
        duration: 5000,
      });
      router.push("/auth?tab=signin");
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${params.slug}/content`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch course");

        setCourse(data);
        if (data.modules[0]?.lessons[0]) {
          setActiveModule(0);
          setActiveLesson(0);
        }

        const totalLessons = data.modules.reduce(
          (sum: number, module: Module) => sum + module.lessons.length,
          0
        );
        const completedLessons = data.modules.reduce(
          (sum: number, module: Module) =>
            sum +
            module.lessons.filter((lesson: Lesson) => lesson.progress.completed)
              .length,
          0
        );
        setProgress(
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
        );
      } catch (err: any) {
        console.error("Course fetch error:", err);
        toast({
          title: "Error",
          description: err.message || "Unable to load course.",
          variant: "destructive",
        });
        router.push("/my-learning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [isLoaded, isSignedIn, userId, user, params.slug, router, toast]);

  const markLessonComplete = async () => {
    if (!course || !currentLesson) return;

    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          completed: true,
        }),
      });
      if (res.ok) {
        const updatedLesson = {
          ...currentLesson,
          progress: { ...currentLesson.progress, completed: true },
        };
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            modules: prev.modules.map((module, mIdx) =>
              mIdx === activeModule
                ? {
                    ...module,
                    lessons: module.lessons.map((lesson, lIdx) =>
                      lIdx === activeLesson ? updatedLesson : lesson
                    ),
                  }
                : module
            ),
          };
        });

        const totalLessons = course.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        );
        const completedLessons = course.modules.reduce(
          (sum, module) =>
            sum +
            module.lessons.filter((lesson) => lesson.progress.completed).length,
          0
        );
        const newProgress =
          totalLessons > 0 ? ((completedLessons + 1) / totalLessons) * 100 : 0;
        setProgress(newProgress);

        toast({
          title: "Lesson Completed",
          description: `${
            currentLesson.title
          } marked as complete! Progress: ${Math.round(newProgress)}%`,
        });

        if (activeLesson < course.modules[activeModule].lessons.length - 1) {
          setActiveLesson(activeLesson + 1);
        } else if (activeModule < course.modules.length - 1) {
          setActiveModule(activeModule + 1);
          setActiveLesson(0);
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update progress");
      }
    } catch (err: any) {
      console.error("Mark complete error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground text-lg">Loading course...</p>
        </main>
      </div>
    );
  }

  if (!course) return null;

  const currentLesson = course.modules[activeModule]?.lessons[activeLesson];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CourseHeader
        course={course}
        progress={progress}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <CourseContent
            currentLesson={currentLesson}
            course={course}
            activeModule={activeModule}
            activeLesson={activeLesson}
            setActiveModule={setActiveModule}
            setActiveLesson={setActiveLesson}
            markLessonComplete={markLessonComplete}
            showSidebar={showSidebar}
          />

          {showSidebar && (
            <>
              <CourseSidebar
                course={course}
                activeModule={activeModule}
                activeLesson={activeLesson}
                setActiveModule={setActiveModule}
                setActiveLesson={setActiveLesson}
              />
              {showNotes && currentLesson && (
                <LessonNotes
                  courseId={course.id}
                  lessonId={currentLesson.id}
                  initialNotes={currentLesson.progress.notes}
                  onClose={() => setShowNotes(false)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

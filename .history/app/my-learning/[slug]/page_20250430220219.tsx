"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useClerk } from "@clerk/nextjs";
import CourseHeader from "@/components/purchease-course/CourseHeader";
import VideoPlayer from "@/components/purchease-course/VideoPlayer";
import LessonContent from "@/components/purchease-course/LessonContent";
import CourseContentSidebar from "@/components/purchease-course/CourseContentSidebar";
import CourseNotes from "@/components/purchease-course/CourseNotes";
import CourseDiscussion from "@/components/purchease-course/CourseDiscussion";
import { Course, Lesson, Module, Note } from "@/types/my-learning";
import { debounce } from "lodash";

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
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [setVideoError] = useState<string | null>(null);
  const [setIsVideoLoading] = useState(false);
  const { toast } = useToast();

  const normalizeYouTubeUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      return url;
    } catch (err) {
      console.error("normalizeYouTubeUrl: Error", err);
      return url;
    }
  };

  const isValidYouTubeUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return regex.test(url);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      console.log("useEffect: Waiting for auth to load");
      return;
    }

    if (!isSignedIn || !userId || !user) {
      console.log("useEffect: User not signed in, redirecting to /auth");
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this course.",
        variant: "destructive",
        duration: 5000,
      });
      router.push(`/auth?tab=signin&redirect=/courses/${params.slug}/learn`);
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      console.log("useEffect: Fetching course", { slug: params.slug });
      try {
        const res = await fetch(`/api/courses/${params.slug}/content`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("fetchCourse: API response", data);
        console.log(
          "fetchCourse: Lesson progress",
          data.modules.map((module: Module) =>
            module.lessons.map((lesson: Lesson) => lesson.progress)
          )
        );
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch course");
        }
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
            module.lessons.filter(
              (lesson: Lesson) => lesson.progress[0]?.completed
            ).length,
          0
        );
        const newProgress =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        setProgress(newProgress);
        console.log("useEffect: Course fetched", {
          courseId: data.id,
          progress: newProgress,
        });
      } catch (err: unknown) {
        console.error("useEffect: Course fetch error", {
          message: err.message,
          slug: params.slug,
        });
        toast({
          title: "Error",
          description: err.message || "Unable to load course.",
          variant: "destructive",
        });
        if (err.message.includes("not enrolled")) {
          console.log("useEffect: Redirecting to course page");
          router.push(`/courses/${params.slug}`);
        } else if (err.message.includes("not found")) {
          console.log("useEffect: Redirecting to 404");
          router.push("/404");
        } else if (err.message.includes("Unauthorized")) {
          console.log("useEffect: Redirecting to auth");
          router.push(
            `/auth?tab=signin&redirect=/courses/${params.slug}/learn`
          );
        } else {
          console.log("useEffect: Staying on page, no redirect");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [isLoaded, isSignedIn, userId, user, params.slug, router, toast]);

  useEffect(() => {
    if (!course || !course.modules[activeModule]?.lessons[activeLesson]) {
      console.log("useEffect: No course or lesson for notes fetch", {
        course,
        activeModule,
        activeLesson,
      });
      return;
    }

    const fetchNotes = async () => {
      try {
        const lessonId = course.modules[activeModule].lessons[activeLesson].id;
        console.log("useEffect: Fetching notes", {
          courseId: course.id,
          lessonId,
        });
        const res = await fetch(
          `/api/courses/notes?courseId=${course.id}&lessonId=${lessonId}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch notes");
        }
        const data = await res.json();
        setNotes(data);
        console.log("useEffect: Notes fetched", { notesCount: data.length });
      } catch (err: any) {
        console.error("useEffect: Notes fetch error", {
          message: err.message,
          courseId: course?.id,
          lessonId: course?.modules[activeModule]?.lessons[activeLesson]?.id,
        });
        toast({
          title: "Error",
          description: err.message || "Unable to load notes.",
          variant: "destructive",
        });
      }
    };

    fetchNotes();
  }, [course, activeModule, activeLesson, toast]);

  const markLessonComplete = async () => {
    if (!course || !course.modules[activeModule]?.lessons[activeLesson]) {
      console.log("markLessonComplete: Invalid course or lesson", {
        course,
        activeModule,
        activeLesson,
      });
      toast({
        title: "Error",
        description: "No lesson selected.",
        variant: "destructive",
      });
      return;
    }

    const currentLesson = course.modules[activeModule].lessons[activeLesson];
    console.log("markLessonComplete: Starting", {
      courseId: course.id,
      lessonId: currentLesson.id,
      activeModule,
      activeLesson,
      isCompleted: currentLesson.progress[0]?.completed || false,
    });

    // Check if lesson is already completed (client-side)
    if (currentLesson.progress[0]?.completed) {
      toast({
        title: "Lesson Already Completed",
        description: `${currentLesson.title} is already marked as complete.`,
      });
      return;
    }

    try {
      // Mark lesson as complete
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          completed: true,
        }),
      });

      console.log("markLessonComplete: API response", {
        status: res.status,
        ok: res.ok,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update progress");
      }

      // Update local state
      const updatedLesson = {
        ...currentLesson,
        progress: currentLesson.progress.length
          ? [
              {
                ...currentLesson.progress[0],
                completed: true,
                completedAt: new Date(),
              },
            ]
          : [{ completed: true, completedAt: new Date() }],
        completed: true, // Sync lesson.completed if needed
      };

      setCourse((prev) => {
        if (!prev) {
          console.log("markLessonComplete: No previous course state");
          return prev;
        }
        const newModules = [...prev.modules];
        newModules[activeModule] = {
          ...newModules[activeModule],
          lessons: newModules[activeModule].lessons.map((lesson, lIdx) =>
            lIdx === activeLesson ? updatedLesson : lesson
          ),
        };
        console.log("markLessonComplete: Course state updated", {
          moduleId: newModules[activeModule].id,
          lessonId: updatedLesson.id,
        });
        return { ...prev, modules: newModules };
      });

      // Recalculate progress
      const totalLessons = course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );
      const completedLessons = course.modules.reduce(
        (sum, module) =>
          sum +
          module.lessons.filter((lesson) => lesson.progress[0]?.completed)
            .length,
        0
      );
      const newProgress =
        totalLessons > 0 ? ((completedLessons + 1) / totalLessons) * 100 : 0;
      setProgress(newProgress);

      console.log("markLessonComplete: Progress updated", { newProgress });

      toast({
        title: "Lesson Completed",
        description: `${
          currentLesson.title
        } marked as complete! Progress: ${Math.round(newProgress)}%`,
      });

      if (activeLesson < course.modules[activeModule].lessons.length - 1) {
        setActiveLesson(activeLesson + 1);
        console.log("markLessonComplete: Advanced to next lesson", {
          newActiveLesson: activeLesson + 1,
        });
      } else if (activeModule < course.modules.length - 1) {
        setActiveModule(activeModule + 1);
        setActiveLesson(0);
        console.log("markLessonComplete: Advanced to next module", {
          newActiveModule: activeModule + 1,
          newActiveLesson: 0,
        });
      } else {
        console.log("markLessonComplete: Course completed");
      }
    } catch (err: any) {
      console.error("markLessonComplete: Error", {
        message: err.message,
        stack: err.stack,
      });
      toast({
        title: "Error",
        description: err.message || "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    }
  };

  const handleProgress = debounce(
    async (state: { playedSeconds: number; played: number }) => {
      if (!course || !course.modules[activeModule]?.lessons[activeLesson]) {
        console.log("handleProgress: No course or lesson available");
        return;
      }

      const currentLesson = course.modules[activeModule].lessons[activeLesson];
      const watchedSeconds = Math.floor(state.playedSeconds);
      const lastPosition = watchedSeconds;

      console.log("handleProgress: Updating", {
        courseId: course.id,
        lessonId: currentLesson.id,
        watchedSeconds,
      });

      try {
        const res = await fetch("/api/courses/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course.id,
            lessonId: currentLesson.id,
            watchedSeconds,
            lastPosition,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("handleProgress: Failed", errorData);
          toast({
            title: "Error",
            description: errorData.error || "Failed to update video progress.",
            variant: "destructive",
          });
        } else {
          console.log("handleProgress: Success");
          setCourse((prev) => {
            if (!prev) return prev;
            const newModules = [...prev.modules];
            newModules[activeModule] = {
              ...newModules[activeModule],
              lessons: newModules[activeModule].lessons.map((lesson, lIdx) =>
                lIdx === activeLesson
                  ? {
                      ...lesson,
                      progress: lesson.progress.length
                        ? [
                            {
                              ...lesson.progress[0],
                              watchedSeconds,
                              lastPosition,
                            },
                          ]
                        : [{ watchedSeconds, lastPosition }],
                    }
                  : lesson
              ),
            };
            return { ...prev, modules: newModules };
          });
        }
      } catch (err) {
        console.error("handleProgress: Error", err);
        toast({
          title: "Error",
          description: "Failed to update video progress.",
          variant: "destructive",
        });
      }
    },
    15000
  );

  const sendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) {
      console.log("sendChatMessage: Empty message, aborting");
      return;
    }

    console.log("sendChatMessage: Sending message", { message: chatMessage });
    try {
      const response = await fetch(`/api/courses/${params.slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: chatMessage }),
        credentials: "include",
      });
      console.log("sendChatMessage: POST response", {
        status: response.status,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the discussion.",
      });
      setChatMessage("");
    } catch (err: any) {
      console.error("sendChatMessage: Error", {
        message: err.message,
        stack: err.stack,
      });
      toast({
        title: "Error",
        description: err.message || "Unable to send message.",
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

  if (!course) {
    return null;
  }

  const currentLesson = course.modules[activeModule]?.lessons[activeLesson];
  console.log("CourseLearningPage: Current lesson", currentLesson);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CourseHeader
        course={course}
        progress={progress}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        setShowNotes={setShowNotes}
        setShowChat={setShowChat}
        activeModule={activeModule}
        activeLesson={activeLesson}
        setActiveModule={setActiveModule}
        setActiveLesson={setActiveLesson}
        setVideoError={setVideoError}
        setIsVideoLoading={setIsVideoLoading}
      />

      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div
            className={
              showSidebar
                ? "lg:col-span-8 space-y-6"
                : "lg:col-span-12 space-y-6"
            }
          >
            <VideoPlayer
              lesson={currentLesson}
              normalizeYouTubeUrl={normalizeYouTubeUrl}
              isValidYouTubeUrl={isValidYouTubeUrl}
              handleProgress={handleProgress}
              courseId={course.id}
            />
            <LessonContent
              course={course}
              lesson={currentLesson}
              activeModule={activeModule}
              activeLesson={activeLesson}
              setActiveModule={setActiveModule}
              setActiveLesson={setActiveLesson}
              setNotes={setNotes}
              setVideoError={setVideoError}
              setIsVideoLoading={setIsVideoLoading}
              markLessonComplete={markLessonComplete}
            />
          </div>

          {showSidebar && (
            <div className="lg:col-span-4 space-y-6">
              <CourseContentSidebar
                course={course}
                progress={progress}
                activeModule={activeModule}
                activeLesson={activeLesson}
                setActiveModule={setActiveModule}
                setActiveLesson={setActiveLesson}
                setNotes={setNotes}
                setVideoError={setVideoError}
                setIsVideoLoading={setIsVideoLoading}
              />
              {showNotes && (
                <CourseNotes
                  course={course}
                  lessonId={currentLesson?.id || ""}
                  notes={notes}
                  setNotes={setNotes}
                  setShowNotes={setShowNotes}
                />
              )}
              {showChat && (
                <CourseDiscussion
                  slug={course?.slug || String(params.slug || "")}
                  showChat={showChat}
                  setShowChat={setShowChat}
                  chatMessage={chatMessage}
                  setChatMessage={setChatMessage}
                  sendChatMessage={sendChatMessage}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

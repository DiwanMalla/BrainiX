"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Play,
  FileText,
  Download,
  Clock,
  ChevronLeft,
  MessageSquare,
  FileQuestion,
  PenLine,
  Send,
  ThumbsUp,
  Lightbulb,
  Award,
  Brain,
  Share2,
  Bookmark,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Home,
  Menu,
} from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useClerk } from "@clerk/nextjs";
import ReactPlayer from "react-player";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
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

interface CourseLearningPageProps {
  params: {
    slug: string;
  };
}

export default function CourseLearningPage({
  params,
}: CourseLearningPageProps) {
  const router = useRouter();
  const { user } = useClerk();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeIntake, setActiveIntake] = useState("current");
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this course.",
        variant: "destructive",
      });
      router.push("/auth?tab=signin");
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${params.slug}/content`, {
          headers: { Authorization: `Bearer ${user.id}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch course");
        }
        setCourse(data);

        // Set first lesson
        if (data.modules[0]?.lessons[0]) {
          setActiveModule(0);
          setActiveLesson(0);
          setNotes(data.modules[0].lessons[0].progress.notes || "");
        }

        // Calculate progress
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
        toast({
          title: "Error",
          description: err.message || "Unable to load course.",
          variant: "destructive",
        });
        if (err.message.includes("not enrolled")) {
          router.push(`/courses/${params.slug}`);
        } else if (err.message.includes("not found")) {
          notFound();
        } else {
          router.push("/my-learning");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [user, params.slug, router]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

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

        // Update progress
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

        // Move to next lesson
        if (activeLesson < course.modules[activeModule].lessons.length - 1) {
          setActiveLesson(activeLesson + 1);
          setNotes(
            course.modules[activeModule].lessons[activeLesson + 1].progress
              .notes || ""
          );
        } else if (activeModule < course.modules.length - 1) {
          setActiveModule(activeModule + 1);
          setActiveLesson(0);
          setNotes(
            course.modules[activeModule + 1].lessons[0].progress.notes || ""
          );
        }
      } else {
        throw new Error("Failed to update progress");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    }
  };

  const saveNotes = async () => {
    if (!course || !currentLesson) return;

    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          notes,
        }),
      });
      if (res.ok) {
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            modules: prev.modules.map((module, mIdx) =>
              mIdx === activeModule
                ? {
                    ...module,
                    lessons: module.lessons.map((lesson, lIdx) =>
                      lIdx === activeLesson
                        ? {
                            ...lesson,
                            progress: { ...lesson.progress, notes },
                          }
                        : lesson
                    ),
                  }
                : module
            ),
          };
        });
        toast({
          title: "Notes Saved",
          description: "Your notes have been saved successfully.",
        });
      } else {
        throw new Error("Failed to save notes");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    }
  };

  const handleProgress = async (state: {
    playedSeconds: number;
    played: number;
  }) => {
    if (!course || !currentLesson) return;

    const watchedSeconds = Math.floor(state.playedSeconds);
    const lastPosition = watchedSeconds;

    try {
      await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          watchedSeconds,
          lastPosition,
        }),
      });
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the discussion.",
      });
      setChatMessage("");
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
    return null; // notFound() handled in useEffect
  }

  const currentLesson = course.modules[activeModule]?.lessons[activeLesson];

  // Mock chat data (since no Message API is provided)
  const currentIntakeMessages = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "SJ",
      message: "Has anyone completed the challenge from lesson 3?",
      time: "10:45 AM",
      likes: 3,
    },
    {
      id: 2,
      user: "David Chen",
      avatar: "DC",
      message:
        "Yes, I found it challenging but rewarding. The key is to focus on the algorithm efficiency.",
      time: "10:52 AM",
      likes: 5,
    },
    {
      id: 3,
      user: "Instructor",
      avatar: "IN",
      message:
        "Great discussion everyone! Remember to check the additional resources I posted for more practice.",
      time: "11:05 AM",
      likes: 8,
      isInstructor: true,
    },
    {
      id: 4,
      user: "Miguel Santos",
      avatar: "MS",
      message:
        "I'm stuck on the second part. Can someone explain how to implement the recursive function?",
      time: "11:15 AM",
      likes: 0,
    },
    {
      id: 5,
      user: "Emma Wilson",
      avatar: "EW",
      message:
        "@Miguel - I can help! The trick is to define your base case correctly. Let me share my approach...",
      time: "11:20 AM",
      likes: 2,
    },
  ];

  const previousIntakeMessages = [
    {
      id: 1,
      user: "Alex Taylor",
      avatar: "AT",
      message:
        "This course has been incredibly helpful for my career transition.",
      time: "Mar 15",
      likes: 12,
    },
    {
      id: 2,
      user: "Priya Patel",
      avatar: "PP",
      message:
        "The project in module 4 was challenging but really improved my skills.",
      time: "Mar 16",
      likes: 8,
    },
    {
      id: 3,
      user: "Instructor",
      avatar: "IN",
      message:
        "Thank you all for your participation in this cohort! I'm glad to see so many of you applying these concepts in your work.",
      time: "Mar 20",
      likes: 15,
      isInstructor: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl"
                  >
                    <Brain className="h-6 w-6 text-primary" />
                    <span>BrainiX</span>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <Link href="/my-learning">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to My Learning
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">
                        <Home className="h-4 w-4 mr-1" />
                        Back to Home
                      </Link>
                    </Button>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Course Content</h3>
                    <nav className="flex flex-col gap-1">
                      {course.modules.map((module, index) => (
                        <div key={module.id} className="mb-2">
                          <div className="font-medium text-sm">
                            {module.title}
                          </div>
                          <div className="ml-2 mt-1 space-y-1">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <Button
                                key={lesson.id}
                                variant="ghost"
                                size="sm"
                                className={`justify-start w-full text-xs h-auto py-1 ${
                                  index === activeModule &&
                                  lessonIndex === activeLesson
                                    ? "bg-accent"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveModule(index);
                                  setActiveLesson(lessonIndex);
                                  setNotes(lesson.progress.notes || "");
                                  document
                                    .querySelector(".sheet-close")
                                    ?.dispatchEvent(new Event("click"));
                                }}
                              >
                                {lesson.title}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl"
              >
                <Brain className="h-6 w-6 text-primary" />
                <span>BrainiX</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-sm md:text-base font-medium truncate max-w-[150px] md:max-w-[300px] lg:max-w-none">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Progress:</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-40 h-2" />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNotes(!showNotes)}
            >
              <PenLine className="h-4 w-4 mr-1" />
              Notes
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Discussion
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-4 w-4 mr-1" />
              {showSidebar ? "Hide Content" : "Show Content"}
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href="/my-learning">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Exit
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - Video Player and Content Navigation */}
          <div
            className={
              showSidebar
                ? "lg:col-span-8 space-y-6"
                : "lg:col-span-12 space-y-6"
            }
          >
            {/* Video Player */}
            <div
              ref={videoContainerRef}
              className="relative bg-black rounded-lg overflow-hidden shadow-lg"
            >
              <div className="aspect-video flex items-center justify-center">
                {currentLesson?.type === "VIDEO" ? (
                  currentLesson.videoUrl ? (
                    <ReactPlayer
                      ref={playerRef}
                      url={currentLesson.videoUrl}
                      width="100%"
                      height="100%"
                      controls
                      muted={isMuted}
                      onProgress={handleProgress}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                          },
                        },
                      }}
                      onReady={() => {
                        if (
                          playerRef.current &&
                          currentLesson.progress.lastPosition
                        ) {
                          playerRef.current.seekTo(
                            currentLesson.progress.lastPosition,
                            "seconds"
                          );
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                      <p className="text-lg font-medium">
                        No video available for this lesson
                      </p>
                    </div>
                  )
                ) : currentLesson?.type === "TEXT" ? (
                  <div className="bg-white w-full h-full p-6 overflow-auto">
                    <div className="prose max-w-none">
                      <h2>Lesson Content: {currentLesson.title}</h2>
                      <p>
                        {currentLesson.content ||
                          "This is a placeholder for the actual lesson content. In a real application, this would contain the full text of the lesson, including paragraphs, images, code snippets, and other educational materials."}
                      </p>
                      <h3>Key Concepts</h3>
                      <ul>
                        <li>First important concept in this lesson</li>
                        <li>
                          Second important concept with additional details
                        </li>
                        <li>Third concept that builds on previous knowledge</li>
                        <li>Practical application of the concepts</li>
                      </ul>
                    </div>
                  </div>
                ) : currentLesson?.type === "QUIZ" ? (
                  <div className="bg-white w-full h-full p-6 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">
                      Quiz: {currentLesson.title}
                    </h2>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-2">
                          1. What is the main concept covered in this lesson?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-a" name="q1" />
                            <label htmlFor="q1-a">Answer option A</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-b" name="q1" />
                            <label htmlFor="q1-b">Answer option B</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-c" name="q1" />
                            <label htmlFor="q1-c">Answer option C</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-d" name="q1" />
                            <label htmlFor="q1-d">Answer option D</label>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-2">
                          2. Which of the following statements is true?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-a" name="q2" />
                            <label htmlFor="q2-a">
                              Statement A that might be true or false
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-b" name="q2" />
                            <label htmlFor="q2-b">
                              Statement B that might be true or false
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-c" name="q2" />
                            <label htmlFor="q2-c">
                              Statement C that might be true or false
                            </label>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Submit Quiz</Button>
                    </div>
                  </div>
                ) : currentLesson?.type === "ASSIGNMENT" ? (
                  <div className="bg-white w-full h-full p-6 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">
                      Assignment: {currentLesson.title}
                    </h2>
                    <p>
                      This is a placeholder for the assignment content. In a
                      real application, this would include instructions,
                      submission guidelines, and resources.
                    </p>
                    <Button className="mt-4">Submit Assignment</Button>
                  </div>
                ) : currentLesson?.type === "LIVE_SESSION" ? (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 w-full h-full p-6 overflow-auto">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center max-w-md">
                        <div className="bg-primary/20 p-4 rounded-full inline-block mb-4">
                          <Award className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                          Live Session
                        </h2>
                        <p className="mb-6">
                          This is a placeholder for a live session. In a real
                          application, this would include a video conferencing
                          link or scheduling information.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">
                          Join Live Session
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <p className="text-lg font-medium">
                      Content not available for this lesson
                    </p>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              {currentLesson?.type === "VIDEO" && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="text-sm font-medium">
                      {currentLesson.duration
                        ? `${Math.floor(currentLesson.duration / 60)}:${(
                            currentLesson.duration % 60
                          )
                            .toString()
                            .padStart(2, "0")}`
                        : "0:00"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info and Navigation */}
            <div className="bg-card rounded-lg border shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold">{currentLesson?.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Badge variant="outline" className="flex items-center">
                      {currentLesson?.type === "VIDEO" ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </>
                      ) : currentLesson?.type === "TEXT" ? (
                        <>
                          <FileText className="h-3 w-3 mr-1" />
                          Article
                        </>
                      ) : currentLesson?.type === "QUIZ" ? (
                        <>
                          <FileQuestion className="h-3 w-3 mr-1" />
                          Quiz
                        </>
                      ) : currentLesson?.type === "ASSIGNMENT" ? (
                        <>
                          <PenLine className="h-3 w-3 mr-1" />
                          Assignment
                        </>
                      ) : (
                        <>
                          <Award className="h-3 w-3 mr-1" />
                          Live Session
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentLesson?.duration
                        ? `${Math.floor(currentLesson.duration / 60)}:${(
                            currentLesson.duration % 60
                          )
                            .toString()
                            .padStart(2, "0")}`
                        : "N/A"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeLesson === 0 && activeModule === 0}
                    onClick={() => {
                      if (activeLesson > 0) {
                        setActiveLesson(activeLesson - 1);
                        setNotes(
                          course.modules[activeModule].lessons[activeLesson - 1]
                            .progress.notes || ""
                        );
                      } else if (activeModule > 0) {
                        setActiveModule(activeModule - 1);
                        setActiveLesson(
                          course.modules[activeModule - 1].lessons.length - 1
                        );
                        setNotes(
                          course.modules[activeModule - 1].lessons[
                            course.modules[activeModule - 1].lessons.length - 1
                          ].progress.notes || ""
                        );
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={markLessonComplete}
                    disabled={currentLesson?.progress.completed}
                  >
                    {currentLesson?.progress.completed
                      ? "Already Completed"
                      : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      activeLesson ===
                        course.modules[activeModule].lessons.length - 1 &&
                      activeModule === course.modules.length - 1
                    }
                    onClick={() => {
                      if (
                        activeLesson <
                        course.modules[activeModule].lessons.length - 1
                      ) {
                        setActiveLesson(activeLesson + 1);
                        setNotes(
                          course.modules[activeModule].lessons[activeLesson + 1]
                            .progress.notes || ""
                        );
                      } else if (activeModule < course.modules.length - 1) {
                        setActiveModule(activeModule + 1);
                        setActiveLesson(0);
                        setNotes(
                          course.modules[activeModule + 1].lessons[0].progress
                            .notes || ""
                        );
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Lesson Content Tabs */}
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="ai-quiz">AI Quiz</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="content"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="prose max-w-none">
                    <h3>Lesson Overview</h3>
                    <p>
                      In this lesson, we'll explore the key concepts of{" "}
                      {currentLesson?.title.toLowerCase()}. You'll learn
                      practical applications and gain hands-on experience
                      through interactive examples.
                    </p>
                    <h4>Learning Objectives</h4>
                    <ul>
                      <li>
                        Understand the fundamental principles of {course.title}
                      </li>
                      <li>
                        Apply theoretical knowledge to practical scenarios
                      </li>
                      <li>
                        Develop problem-solving skills through guided exercises
                      </li>
                      <li>
                        Build a foundation for advanced topics in future lessons
                      </li>
                    </ul>
                    <h4>Key Takeaways</h4>
                    <p>
                      By the end of this lesson, you should be able to
                      confidently implement the concepts covered and understand
                      how they fit into the broader context of {course.title}.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent
                  value="resources"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Supplementary Materials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(currentLesson?.resources || []).length > 0 ? (
                        currentLesson.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <FileText className="h-5 w-5 mr-3 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {resource.type},{" "}
                                {resource.size
                                  ? `${(resource.size / 1024 / 1024).toFixed(
                                      1
                                    )} MB`
                                  : "N/A"}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={resource.url} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No resources available for this lesson.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="transcript"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Video Transcript
                      </h3>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                      <p className="text-muted-foreground">
                        Transcript not available. This is a placeholder for the
                        actual transcript content.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="ai-quiz"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        AI-Generated Quiz
                      </h3>
                      <Button>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate New Quiz
                      </Button>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <p className="text-sm">
                          This quiz is generated by AI based on the content of
                          this lesson. Each time you generate a new quiz, you'll
                          get different questions to test your knowledge.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-3">
                          1. What is the primary focus of this lesson?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-a" name="q1" />
                            <label htmlFor="q1-a">
                              Understanding theoretical concepts only
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-b" name="q1" />
                            <label htmlFor="q1-b">
                              Practical application of core principles
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-c" name="q1" />
                            <label htmlFor="q1-c">
                              Historical development of the subject
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q1-d" name="q1" />
                            <label htmlFor="q1-d">
                              Advanced techniques beyond the basics
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-3">
                          2. Based on the content covered, which of the
                          following best describes the application of these
                          principles?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-a" name="q2" />
                            <label htmlFor="q2-a">
                              They lead to improvements in efficiency and
                              effectiveness
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-b" name="q2" />
                            <label htmlFor="q2-b">
                              They are primarily theoretical with limited
                              practical use
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-c" name="q2" />
                            <label htmlFor="q2-c">
                              They are only applicable in specialized industries
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q2-d" name="q2" />
                            <label htmlFor="q2-d">
                              They require advanced knowledge to implement
                            </label>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Submit Answers</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right side - Course Content and Chat */}
          {showSidebar && (
            <div className="lg:col-span-4 space-y-6">
              {/* Course Content Navigation */}
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                  <h2 className="font-semibold">Course Content</h2>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                    <span>
                      {course.modules.length} modules •{" "}
                      {course.modules.reduce(
                        (total, module) => total + module.lessons.length,
                        0
                      )}{" "}
                      lessons
                    </span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2 mt-2" />
                </div>

                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={`module-${activeModule}`}
                  >
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem key={module.id} value={module.id}>
                        <AccordionTrigger
                          className={`px-4 py-3 ${
                            moduleIndex === activeModule ? "bg-accent/50" : ""
                          }`}
                        >
                          <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-2">
                              <span>{module.title}</span>
                              {module.lessons.every(
                                (lesson) => lesson.progress.completed
                              ) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {module.lessons.length} lessons
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 py-0">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-accent/30 transition-colors ${
                                moduleIndex === activeModule &&
                                lessonIndex === activeLesson
                                  ? "bg-accent/50"
                                  : ""
                              }`}
                              onClick={() => {
                                setActiveModule(moduleIndex);
                                setActiveLesson(lessonIndex);
                                setNotes(lesson.progress.notes || "");
                              }}
                            >
                              <div className="flex-shrink-0">
                                {lesson.progress.completed ? (
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </div>
                                ) : (
                                  <div className="h-6 w-6 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                                    {lesson.type === "VIDEO" ? (
                                      <Play className="h-3 w-3" />
                                    ) : lesson.type === "TEXT" ? (
                                      <FileText className="h-3 w-3" />
                                    ) : lesson.type === "QUIZ" ? (
                                      <FileQuestion className="h-3 w-3" />
                                    ) : lesson.type === "ASSIGNMENT" ? (
                                      <PenLine className="h-3 w-3" />
                                    ) : (
                                      <Award className="h-3 w-3" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {lesson.type === "VIDEO" ? (
                                    <span className="flex items-center">
                                      <Play className="h-3 w-3 mr-1" />
                                      Video
                                    </span>
                                  ) : lesson.type === "TEXT" ? (
                                    <span className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Article
                                    </span>
                                  ) : lesson.type === "QUIZ" ? (
                                    <span className="flex items-center">
                                      <FileQuestion className="h-3 w-3 mr-1" />
                                      Quiz
                                    </span>
                                  ) : lesson.type === "ASSIGNMENT" ? (
                                    <span className="flex items-center">
                                      <PenLine className="h-3 w-3 mr-1" />
                                      Assignment
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <Award className="h-3 w-3 mr-1" />
                                      Live Session
                                    </span>
                                  )}
                                  <span>
                                    {lesson.duration
                                      ? `${Math.floor(lesson.duration / 60)}:${(
                                          lesson.duration % 60
                                        )
                                          .toString()
                                          .padStart(2, "0")}`
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              {/* Notes Panel */}
              {showNotes && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
                      <h3 className="font-semibold">Your Notes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotes(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Textarea
                        className="min-h-[200px] mb-3"
                        placeholder="Take notes for this lesson..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={saveNotes}>
                          <PenLine className="h-4 w-4 mr-2" />
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Discussion Chat */}
              {showChat && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-muted/50 border-b">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Course Discussion</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowChat(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>24 online</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span>156 total students</span>
                      </div>

                      <Tabs
                        defaultValue="current"
                        className="mt-3"
                        onValueChange={setActiveIntake}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="current">
                            Current Intake
                          </TabsTrigger>
                          <TabsTrigger value="previous">
                            Previous Intake
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <ScrollArea className="h-[300px] p-4">
                      {activeIntake === "current" ? (
                        <div className="space-y-4">
                          {currentIntakeMessages.map((msg) => (
                            <div key={msg.id} className="flex gap-3">
                              <Avatar
                                className={
                                  msg.isInstructor
                                    ? "border-2 border-primary"
                                    : ""
                                }
                              >
                                <AvatarFallback>{msg.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {msg.user}
                                  </span>
                                  {msg.isInstructor && (
                                    <Badge
                                      variant="outline"
                                      className="text-primary border-primary text-xs"
                                    >
                                      Instructor
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {msg.time}
                                  </span>
                                </div>
                                <p className="mt-1">{msg.message}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {msg.likes}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-3 bg-muted/30 rounded-md text-sm">
                            <p className="text-muted-foreground">
                              This is an archive of discussions from the
                              previous course intake. You can read these
                              messages but cannot reply to them.
                            </p>
                          </div>
                          {previousIntakeMessages.map((msg) => (
                            <div key={msg.id} className="flex gap-3">
                              <Avatar
                                className={
                                  msg.isInstructor
                                    ? "border-2 border-primary"
                                    : ""
                                }
                              >
                                <AvatarFallback>{msg.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {msg.user}
                                  </span>
                                  {msg.isInstructor && (
                                    <Badge
                                      variant="outline"
                                      className="text-primary border-primary text-xs"
                                    >
                                      Instructor
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {msg.time}
                                  </span>
                                </div>
                                <p className="mt-1">{msg.message}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="text-xs text-muted-foreground">
                                    <ThumbsUp className="h-3 w-3 inline mr-1" />
                                    {msg.likes} likes
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {activeIntake === "current" && (
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type your message..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendChatMessage();
                              }
                            }}
                          />
                          <Button onClick={sendChatMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

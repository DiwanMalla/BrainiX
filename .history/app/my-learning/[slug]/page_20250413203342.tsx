"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
import { getCourseBySlug } from "@/lib/courses-data";
import {
  getPurchasedCourses,
  updateCourseProgress,
  isPurchased,
} from "@/lib/local-storage";
import { notFound, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CourseLearningPageProps {
  params: {
    slug: string;
  };
}

export default function CourseLearningPage({
  params,
}: CourseLearningPageProps) {
  const router = useRouter();
  const course = getCourseBySlug(params.slug);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPurchasedCourse, setIsPurchasedCourse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeIntake, setActiveIntake] = useState("current");
  const [showNotes, setShowNotes] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (course) {
      // Check if course is purchased
      const purchased = isPurchased(course.id);
      setIsPurchasedCourse(purchased);

      if (!purchased) {
        // Redirect to course page if not purchased
        router.push(`/courses/${params.slug}`);
        return;
      }

      // Get progress from local storage
      const purchasedCourses = getPurchasedCourses();
      const purchasedCourse = purchasedCourses.find((c) => c.id === course.id);
      if (purchasedCourse) {
        setProgress(purchasedCourse.progress);
      }
    }
  }, [course, params.slug, router]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (!course) {
    notFound();
  }

  if (!isPurchasedCourse) {
    // Show loading while redirecting
    return <div>Checking access...</div>;
  }

  // Mock lesson data - in a real app, this would come from an API
  const modules = course.syllabus.map((module, index) => {
    // Generate mock lessons for each module
    const lessonCount = module.lectures;
    const lessons = Array.from({ length: lessonCount }, (_, i) => {
      const lessonType =
        i % 4 === 0
          ? "video"
          : i % 4 === 1
          ? "text"
          : i % 4 === 2
          ? "quiz"
          : "milestone";
      return {
        id: `lesson-${index}-${i}`,
        title: `Lesson ${i + 1}: ${module.title} - Part ${i + 1}`,
        duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
        type: lessonType,
        completed: Math.random() > 0.5,
      };
    });

    return {
      ...module,
      id: `module-${index}`,
      lessons,
    };
  });

  const currentLesson = modules[activeModule]?.lessons[activeLesson];

  // Mock chat data
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

  const markLessonComplete = () => {
    // Update progress
    const totalLessons = modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );
    const completedLessons =
      modules.reduce((total, module) => {
        return (
          total + module.lessons.filter((lesson) => lesson.completed).length
        );
      }, 0) + 1; // +1 for the current lesson

    const newProgress = Math.round((completedLessons / totalLessons) * 100);
    setProgress(newProgress);

    // Update in local storage
    updateCourseProgress(course.id, newProgress);

    // Show toast
    toast({
      title: "Progress updated",
      description: `Lesson marked as complete. Overall progress: ${newProgress}%`,
    });

    // Move to next lesson if available
    if (activeLesson < modules[activeModule].lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    } else if (activeModule < modules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveLesson(0);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the discussion",
      });
      setChatMessage("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Custom header for learning environment */}
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
                      {modules.map((module, index) => (
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
                                  document
                                    .querySelector("sheet-close")
                                    ?.click();
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
                <span className="text-sm">{progress}%</span>
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
                {currentLesson.type === "video" ? (
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                    <p className="text-lg font-medium">
                      Video content would play here
                    </p>
                    <p className="text-sm opacity-70">
                      This is a placeholder for the actual video content
                    </p>
                  </div>
                ) : currentLesson.type === "text" ? (
                  <div className="bg-white w-full h-full p-6 overflow-auto">
                    <div className="prose max-w-none">
                      <h2>Lesson Content: {currentLesson.title}</h2>
                      <p>
                        This is a placeholder for the actual lesson content. In
                        a real application, this would contain the full text of
                        the lesson, including paragraphs, images, code snippets,
                        and other educational materials.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam euismod, nisl eget aliquam ultricies, nunc nisl
                        aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam
                        euismod, nisl eget aliquam ultricies, nunc nisl aliquet
                        nunc, quis aliquam nisl nunc quis nisl.
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
                      <p>
                        Nullam euismod, nisl eget aliquam ultricies, nunc nisl
                        aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam
                        euismod, nisl eget aliquam ultricies, nunc nisl aliquet
                        nunc, quis aliquam nisl nunc quis nisl.
                      </p>
                    </div>
                  </div>
                ) : currentLesson.type === "quiz" ? (
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
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 w-full h-full p-6 overflow-auto">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center max-w-md">
                        <div className="bg-primary/20 p-4 rounded-full inline-block mb-4">
                          <Award className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                          Module Milestone
                        </h2>
                        <p className="mb-6">
                          Congratulations on reaching this milestone! Let's test
                          your knowledge with an AI-generated quiz based on what
                          you've learned.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Brain className="mr-2 h-4 w-4" />
                          Generate AI Quiz
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
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
                    {currentLesson.duration}
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
            </div>

            {/* Lesson Info and Navigation */}
            <div className="bg-card rounded-lg border shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold">{currentLesson.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Badge variant="outline" className="flex items-center">
                      {currentLesson.type === "video" ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </>
                      ) : currentLesson.type === "text" ? (
                        <>
                          <FileText className="h-3 w-3 mr-1" />
                          Article
                        </>
                      ) : currentLesson.type === "quiz" ? (
                        <>
                          <FileQuestion className="h-3 w-3 mr-1" />
                          Quiz
                        </>
                      ) : (
                        <>
                          <Award className="h-3 w-3 mr-1" />
                          Milestone
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentLesson.duration}
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
                      } else if (activeModule > 0) {
                        setActiveModule(activeModule - 1);
                        setActiveLesson(
                          modules[activeModule - 1].lessons.length - 1
                        );
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button size="sm" onClick={markLessonComplete}>
                    {currentLesson.completed
                      ? "Already Completed"
                      : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      activeLesson ===
                        modules[activeModule].lessons.length - 1 &&
                      activeModule === modules.length - 1
                    }
                    onClick={() => {
                      if (
                        activeLesson <
                        modules[activeModule].lessons.length - 1
                      ) {
                        setActiveLesson(activeLesson + 1);
                      } else if (activeModule < modules.length - 1) {
                        setActiveModule(activeModule + 1);
                        setActiveLesson(0);
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
                      {currentLesson.title.toLowerCase()}. You'll learn
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
                      <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Lesson Slides</p>
                          <p className="text-sm text-muted-foreground">
                            PDF, 2.4 MB
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Exercise Files</p>
                          <p className="text-sm text-muted-foreground">
                            ZIP, 5.1 MB
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Cheat Sheet</p>
                          <p className="text-sm text-muted-foreground">
                            PDF, 1.2 MB
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <FileText className="h-5 w-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Additional Reading</p>
                          <p className="text-sm text-muted-foreground">
                            PDF, 3.7 MB
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6">
                      External Resources
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <a
                          href="#"
                          className="text-primary hover:underline font-medium"
                        >
                          Advanced Guide to {course.title}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive resource for deeper understanding
                        </p>
                      </div>
                      <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <a
                          href="#"
                          className="text-primary hover:underline font-medium"
                        >
                          Official Documentation
                        </a>
                        <p className="text-sm text-muted-foreground">
                          Reference materials from the official source
                        </p>
                      </div>
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
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            00:00
                          </span>
                          <p>
                            Welcome to this lesson on {currentLesson.title}.
                            Today we'll be covering some essential concepts that
                            will help you master this subject.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            00:15
                          </span>
                          <p>
                            Let's start by understanding the core principles
                            that underpin this topic.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            00:30
                          </span>
                          <p>
                            The first key concept we need to grasp is how these
                            principles apply in real-world scenarios.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            01:45
                          </span>
                          <p>
                            Now, let's look at some practical examples to
                            illustrate these concepts.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            03:20
                          </span>
                          <p>
                            As you can see from this demonstration, the
                            application of these principles can lead to
                            significant improvements in efficiency and
                            effectiveness.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            05:10
                          </span>
                          <p>
                            Let's now move on to some common challenges you
                            might face and how to overcome them.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            08:30
                          </span>
                          <p>
                            To summarize what we've covered today: we've learned
                            about the fundamental principles, seen practical
                            applications, and discussed strategies for
                            overcoming common challenges.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-muted-foreground text-sm">
                            09:45
                          </span>
                          <p>
                            In the next lesson, we'll build on these concepts
                            and explore more advanced techniques. Thank you for
                            watching!
                          </p>
                        </div>
                      </div>
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

                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-3">
                          3. What will be covered in the next lesson according
                          to the transcript?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q3-a" name="q3" />
                            <label htmlFor="q3-a">
                              Review of current concepts
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q3-b" name="q3" />
                            <label htmlFor="q3-b">
                              Introduction to a new topic
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q3-c" name="q3" />
                            <label htmlFor="q3-c">
                              More advanced techniques
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="radio" id="q3-d" name="q3" />
                            <label htmlFor="q3-d">
                              Historical context of the subject
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
                      {modules.length} modules •{" "}
                      {course.syllabus.reduce(
                        (total, module) => total + module.lectures,
                        0
                      )}{" "}
                      lessons
                    </span>
                    <span>{progress}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2 mt-2" />
                </div>

                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={`module-${activeModule}`}
                  >
                    {modules.map((module, moduleIndex) => (
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
                                (lesson) => lesson.completed
                              ) && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {module.lectures} lessons • {module.duration}
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
                              }}
                            >
                              <div className="flex-shrink-0">
                                {lesson.completed ? (
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </div>
                                ) : (
                                  <div className="h-6 w-6 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                                    {lesson.type === "video" ? (
                                      <Play className="h-3 w-3" />
                                    ) : lesson.type === "text" ? (
                                      <FileText className="h-3 w-3" />
                                    ) : lesson.type === "quiz" ? (
                                      <FileQuestion className="h-3 w-3" />
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
                                  {lesson.type === "video" ? (
                                    <span className="flex items-center">
                                      <Play className="h-3 w-3 mr-1" />
                                      Video
                                    </span>
                                  ) : lesson.type === "text" ? (
                                    <span className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Article
                                    </span>
                                  ) : lesson.type === "quiz" ? (
                                    <span className="flex items-center">
                                      <FileQuestion className="h-3 w-3 mr-1" />
                                      Quiz
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <Award className="h-3 w-3 mr-1" />
                                      Milestone
                                    </span>
                                  )}
                                  <span>{lesson.duration}</span>
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

              {/* Notes Panel (conditionally rendered) */}
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
                      />
                      <div className="flex justify-end">
                        <Button size="sm">
                          <PenLine className="h-4 w-4 mr-2" />
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Discussion Chat (conditionally rendered) */}
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

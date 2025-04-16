"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  CheckCircle,
  PlayCircle,
  Pencil,
  Save,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  Download,
  Brain,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";
import ReactPlayer from "react-player";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
  type: "video" | "text" | "quiz";
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

interface CourseContent {
  id: string;
  title: string;
  thumbnail: string | null;
  instructor: { name: string };
  modules: Module[];
}

export default function CourseContentPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<ReactPlayer | null>(null);

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

    const fetchCourseContent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${params.slug}/content`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch course content");
        }
        setCourse(data);
        const firstLesson = data.modules[0]?.lessons[0];
        if (firstLesson) {
          setCurrentLesson(firstLesson);
          setNotes(firstLesson.progress.notes || "");
        }
        // Calculate initial progress
        const totalLessons = data.modules.reduce(
          (total: number, module: Module) => total + module.lessons.length,
          0
        );
        const completedLessons = data.modules.reduce(
          (total: number, module: Module) =>
            total +
            module.lessons.filter((lesson: Lesson) => lesson.progress.completed)
              .length,
          0
        );
        setProgress(Math.round((completedLessons / totalLessons) * 100));
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Unable to load course content.",
          variant: "destructive",
        });
        router.push("/my-learning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseContent();
  }, [user, params.slug, router, toast]);

  const handleProgress = async (state: {
    playedSeconds: number;
    played: number;
  }) => {
    if (!currentLesson || !course) return;

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

  const handleMarkComplete = async () => {
    if (!currentLesson || !course) return;

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
        setCurrentLesson(updatedLesson);
        toast({
          title: "Lesson Completed",
          description: `${currentLesson.title} marked as complete!`,
        });

        // Update course state and progress
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            modules: prev.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === currentLesson.id ? updatedLesson : lesson
              ),
            })),
          };
        });

        const totalLessons = course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );
        const completedLessons = course.modules.reduce(
          (total, module) =>
            total +
            module.lessons.filter((lesson) => lesson.progress.completed).length,
          0
        );
        setProgress(Math.round(((completedLessons + 1) / totalLessons) * 100));
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!currentLesson || !course) return;

    setSavingNotes(true);
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
        toast({
          title: "Notes Saved",
          description: "Your notes have been saved successfully.",
        });
        setCurrentLesson({
          ...currentLesson,
          progress: { ...currentLesson.progress, notes },
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been posted to the discussion.",
      });
      setChatMessage("");
    }
  };

  const selectLesson = (
    lesson: Lesson,
    moduleIndex: number,
    lessonIndex: number
  ) => {
    setCurrentLesson(lesson);
    setNotes(lesson.progress.notes || "");
    if (playerRef.current) {
      playerRef.current.seekTo(lesson.progress.lastPosition, "seconds");
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    for (let i = 0; i < course.modules.length; i++) {
      const module = course.modules[i];
      const lessonIndex = module.lessons.findIndex(
        (l) => l.id === currentLesson.id
      );
      if (lessonIndex !== -1) {
        if (lessonIndex < module.lessons.length - 1) {
          return { moduleIndex: i, lessonIndex: lessonIndex + 1 };
        } else if (i < course.modules.length - 1) {
          return { moduleIndex: i + 1, lessonIndex: 0 };
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    for (let i = 0; i < course.modules.length; i++) {
      const module = course.modules[i];
      const lessonIndex = module.lessons.findIndex(
        (l) => l.id === currentLesson.id
      );
      if (lessonIndex !== -1) {
        if (lessonIndex > 0) {
          return { moduleIndex: i, lessonIndex: lessonIndex - 1 };
        } else if (i > 0) {
          return {
            moduleIndex: i - 1,
            lessonIndex: course.modules[i - 1].lessons.length - 1,
          };
        }
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground text-lg">Loading course content...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
              <p className="text-muted-foreground mb-6">
                This course is not available or you don’t have access.
              </p>
              <Button asChild>
                <Link href="/my-learning">Back to My Learning</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground mt-1">
                  Instructor: {course.instructor.name}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  Progress: {progress}%
                  <Progress value={progress} className="w-40 h-2 mt-1" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-0">
                  {currentLesson?.videoUrl && currentLesson.type === "video" ? (
                    <div className="aspect-video">
                      <ReactPlayer
                        ref={playerRef}
                        url={currentLesson.videoUrl}
                        width="100%"
                        height="100%"
                        controls
                        onProgress={handleProgress}
                        config={{
                          file: {
                            attributes: {
                              controlsList: "nodownload",
                            },
                          },
                        }}
                      />
                    </div>
                  ) : currentLesson?.type === "text" ? (
                    <div className="aspect-video bg-white p-6 overflow-auto">
                      <div className="prose max-w-none">
                        <h2>{currentLesson.title}</h2>
                        <p>
                          This is placeholder text content for the lesson. In a
                          real application, this would contain the full lesson
                          content with rich formatting.
                        </p>
                      </div>
                    </div>
                  ) : currentLesson?.type === "quiz" ? (
                    <div className="aspect-video bg-white p-6 overflow-auto">
                      <h2 className="text-xl font-bold mb-4">
                        Quiz: {currentLesson.title}
                      </h2>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium mb-2">
                            Sample quiz question?
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="radio" name="q1" />
                              <label>Option A</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="radio" name="q1" />
                              <label>Option B</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">
                        No content available for this lesson.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardHeader>
                  <CardTitle>{currentLesson?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {currentLesson?.progress.completed ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkComplete}
                      >
                        Mark as Complete
                      </Button>
                    )}
                    {currentLesson?.duration && (
                      <Badge variant="outline">
                        {Math.floor(currentLesson.progress.watchedSeconds / 60)}
                        /{Math.floor(currentLesson.duration / 60)} min
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!getPreviousLesson()}
                      onClick={() => {
                        const prev = getPreviousLesson();
                        if (prev) {
                          selectLesson(
                            course.modules[prev.moduleIndex].lessons[
                              prev.lessonIndex
                            ],
                            prev.moduleIndex,
                            prev.lessonIndex
                          );
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!getNextLesson()}
                      onClick={() => {
                        const next = getNextLesson();
                        if (next) {
                          selectLesson(
                            course.modules[next.moduleIndex].lessons[
                              next.lessonIndex
                            ],
                            next.moduleIndex,
                            next.lessonIndex
                          );
                        }
                      }}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  <Tabs defaultValue="notes" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="quiz">AI Quiz</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notes">
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">Notes</h3>
                          <Button
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {savingNotes ? "Saving..." : "Save Notes"}
                          </Button>
                        </div>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add your notes here..."
                          rows={6}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="resources">
                      <div className="mt-4 space-y-4">
                        <h3 className="font-semibold">Resources</h3>
                        <div className="flex items-center p-3 border rounded-md">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">Lesson Materials</p>
                            <p className="text-sm text-muted-foreground">
                              PDF, 2 MB
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="transcript">
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Transcript</h3>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <ScrollArea className="h-[200px]">
                          <p className="text-sm">
                            Sample transcript content for the lesson video...
                          </p>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="quiz">
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">AI-Generated Quiz</h3>
                          <Button variant="outline" size="sm">
                            <Brain className="h-4 w-4 mr-2" />
                            Generate Quiz
                          </Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium mb-2">
                            Sample quiz question?
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="radio" name="quiz1" />
                              <label>Option A</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="radio" name="quiz1" />
                              <label>Option B</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {showChat && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Course Discussion</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowChat(false)}
                      >
                        Close
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px] mb-4">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <div className="font-medium">User:</div>
                          <p className="text-sm">
                            Sample discussion message...
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                      />
                      <Button onClick={sendChatMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Course Content Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {progress}% complete
                    <Progress value={progress} className="h-2 mt-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={course.modules[0]?.id}
                  >
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem key={module.id} value={module.id}>
                        <AccordionTrigger>{module.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lesson.id}>
                                <Button
                                  variant={
                                    currentLesson?.id === lesson.id
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="w-full justify-start text-left"
                                  onClick={() =>
                                    selectLesson(
                                      lesson,
                                      moduleIndex,
                                      lessonIndex
                                    )
                                  }
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  <span className="flex-1 truncate">
                                    {lesson.title}
                                  </span>
                                  {lesson.progress.completed && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

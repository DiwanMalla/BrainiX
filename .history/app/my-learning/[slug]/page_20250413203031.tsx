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
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle, PlayCircle, Pencil, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";
import ReactPlayer from "react-player";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
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
        // Set first lesson as default
        const firstLesson = data.modules[0]?.lessons[0];
        if (firstLesson) {
          setCurrentLesson(firstLesson);
          setNotes(firstLesson.progress.notes || "");
        }
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

        // Update course state
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

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setNotes(lesson.progress.notes || "");
    if (playerRef.current) {
      playerRef.current.seekTo(lesson.progress.lastPosition, "seconds");
    }
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
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">
              Instructor: {course.instructor.name}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Video Player and Notes */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  {currentLesson?.videoUrl ? (
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
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">
                        No video available for this lesson.
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

                  <div>
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
                </CardContent>
              </Card>
            </div>

            {/* Course Content Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module) => (
                      <AccordionItem key={module.id} value={module.id}>
                        <AccordionTrigger>{module.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <li key={lesson.id}>
                                <Button
                                  variant={
                                    currentLesson?.id === lesson.id
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="w-full justify-start text-left"
                                  onClick={() => selectLesson(lesson)}
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

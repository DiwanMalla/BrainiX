"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  ChevronLeft,
  Home,
  Menu,
  MessageSquare,
  PenLine,
} from "lucide-react";
import { Course, Note } from "@/types/my-learning";

interface CourseHeaderProps {
  course: Course | null;
  progress: number;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
  setShowNotes: (value: boolean) => void;
  setShowChat: (value: boolean) => void;
  activeModule: number;
  activeLesson: number;
  setActiveModule: (value: number) => void;
  setActiveLesson: (value: number) => void;
  setNotes: (value: Note[]) => void;
  setVideoError: (value: string | null) => void;
  setIsVideoLoading: (value: boolean) => void;
}

export default function CourseHeader({
  course,
  progress,
  showSidebar,
  setShowSidebar,
  setShowNotes,
  setShowChat,
  activeModule,
  activeLesson,
  setActiveModule,
  setActiveLesson,
  setNotes,
  setVideoError,
  setIsVideoLoading,
}: CourseHeaderProps) {
  return (
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
                    {course?.modules?.map((module, index) => (
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
                              onClick={async () => {
                                setActiveModule(index);
                                setActiveLesson(lessonIndex);
                                try {
                                  const res = await fetch(
                                    `/api/courses/notes?courseId=${course.id}&lessonId=${lesson.id}`,
                                    { credentials: "include" }
                                  );
                                  if (!res.ok) {
                                    throw new Error("Failed to fetch notes");
                                  }
                                  const data = await res.json();
                                  setNotes(data);
                                } catch (err) {
                                  console.error("Error fetching notes:", err);
                                }
                                setVideoError(null);
                                setIsVideoLoading(true);
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
              {course?.title}
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
            onClick={() => setShowNotes((prev: boolean) => !prev)}
          >
            <PenLine className="h-4 w-4 mr-1" />
            Notes
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowChat((prev: boolean) => !prev)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Discussion
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSidebar((prev: boolean) => !prev)}
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
  );
}

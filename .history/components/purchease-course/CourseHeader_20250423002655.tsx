"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Brain, ChevronLeft, Home, Menu, PenLine } from "lucide-react";
import { CourseSidebar } from "./CourseSidebar";

interface CourseHeaderProps {
  course: { id: string; title: string; modules: any[] };
  progress: number;
  showNotes: boolean;
  setShowNotes: (value: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

export function CourseHeader({
  course,
  progress,
  showNotes,
  setShowNotes,
  showSidebar,
  setShowSidebar,
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
                  <CourseSidebar
                    course={course}
                    activeModule={0}
                    activeLesson={0}
                    setActiveModule={() => {}}
                    setActiveLesson={() => {}}
                  />
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
  );
}

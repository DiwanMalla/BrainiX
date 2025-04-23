"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileText, PenLine, Play } from "lucide-react";

interface CourseSidebarProps {
  course: any;
  activeModule: number;
  activeLesson: number;
  setActiveModule: (value: number) => void;
  setActiveLesson: (value: number) => void;
}

export function CourseSidebar({
  course,
  activeModule,
  activeLesson,
  setActiveModule,
  setActiveLesson,
}: CourseSidebarProps) {
  const progress =
    (course.modules.reduce(
      (sum: number, module: any) =>
        sum +
        module.lessons.filter((lesson: any) => lesson.progress.completed)
          .length,
      0
    ) /
      course.modules.reduce(
        (sum: number, module: any) => sum + module.lessons.length,
        0
      )) *
    100;

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="font-semibold">Course Content</h2>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>
              {course.modules.length} modules •{" "}
              {course.modules.reduce(
                (total: number, module: any) => total + module.lessons.length,
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
            {course.modules.map((module: any, moduleIndex: number) => (
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
                        (lesson: any) => lesson.progress.completed
                      ) && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 py-0">
                  {module.lessons.map((lesson: any, lessonIndex: number) => (
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
                            ) : (
                              <PenLine className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{lesson.type}</span>
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
    </div>
  );
}

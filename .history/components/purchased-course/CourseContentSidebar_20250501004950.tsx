"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Award,
  CheckCircle,
  FileQuestion,
  FileText,
  PenLine,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course, Note } from "@/types/my-learning";

import { Dispatch, SetStateAction } from "react";

interface CourseContentSidebarProps {
  course: Course | null;
  progress: number;
  activeModule: number;
  activeLesson: number;
  setActiveModule: (value: number) => void;
  setActiveLesson: (value: number) => void;
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  setVideoError: (value: string | null) => void;
  setIsVideoLoading: (value: boolean) => void;
}

export default function CourseContentSidebar({
  course,
  progress,
  activeModule,
  activeLesson,
  setActiveModule,
  setActiveLesson,
  notes,

  setVideoError,
  setIsVideoLoading,
}: CourseContentSidebarProps) {
  // const handleAddNote = debounce((content: string) => {
  //   if (!course || !course.modules[activeModule]?.lessons[activeLesson]) return;
  //   const newNote: Note = {
  //     id: crypto.randomUUID(),
  //     content,
  //     lessonId: course.modules[activeModule].lessons[activeLesson].id,
  //     courseId: course.id,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };
  //   setNotes((prevNotes) => [...prevNotes, newNote]);
  // }, 300);

  // Handle lesson switching with validation
  const switchLesson = (moduleIndex: number, lessonIndex: number) => {
    if (
      course &&
      moduleIndex >= 0 &&
      moduleIndex < course.modules.length &&
      lessonIndex >= 0 &&
      lessonIndex < course.modules[moduleIndex].lessons.length
    ) {
      setActiveModule(moduleIndex);
      setActiveLesson(lessonIndex);
      setVideoError(null); // Reset video error when switching lessons
      setIsVideoLoading(true); // Set loading state for new lesson
    }
  };

  if (!course) {
    return <div>No course data available</div>;
  }

  return (
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
        <ProgressBar value={progress} className="h-2 mt-2" />
      </div>

      <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue={`module-${activeModule}`}
        >
          {course.modules.map((module, moduleIndex) => {
            // Check if all lessons in the module are completed
            const allLessonsCompleted = module.lessons.every(
              (lesson) => lesson.progress[0]?.completed === true
            );

            // Log lesson details for debugging
            module.lessons.forEach((lesson, index) => {
              console.log(`Lesson ${index}:`, {
                id: lesson.id,
                title: lesson.title,
                progress: lesson.progress,
                completed: lesson.progress[0]?.completed,
              });
            });

            return (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger
                  className={`px-4 py-3 ${
                    moduleIndex === activeModule ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span>{module.title}</span>
                      {allLessonsCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 py-0">
                  {module.lessons.map((lesson, lessonIndex) => {
                    // Filter notes for this lesson
                    const lessonNotes = notes.filter(
                      (note) => note.lessonId === lesson.id
                    );
                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-accent/30 transition-colors ${
                          moduleIndex === activeModule &&
                          lessonIndex === activeLesson
                            ? "bg-accent/50"
                            : ""
                        }`}
                        onClick={() => switchLesson(moduleIndex, lessonIndex)}
                      >
                        <div className="flex-shrink-0">
                          {lesson.progress[0]?.completed ? (
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
                            {lesson.isPreview && (
                              <span className="flex items-center">
                                <Badge className="bg-secondary text-secondary-foreground">
                                  Preview
                                </Badge>
                              </span>
                            )}
                          </div>
                          {/* Display notes for this lesson */}
                          {lessonNotes.length > 0 && (
                            <ul className="mt-2 text-xs text-muted-foreground">
                              {lessonNotes.map((note) => (
                                <li key={note.id} className="truncate">
                                  {note.content}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Award,
  Clock,
  FileQuestion,
  FileText,
  PenLine,
  Play,
} from "lucide-react";
import { Course, Lesson } from "@/types/globals";
import AIGeneratedQuiz from "@/components/quiz/AIGeneratedQuiz";

interface LessonContentProps {
  course: Course;
  lesson: Lesson | undefined;
  activeModule: number;
  activeLesson: number;
  setActiveModule: (value: number) => void;
  setActiveLesson: (value: number) => void;
  setNotes: (value: string) => void;
  setVideoError: (value: string | null) => void;
  setIsVideoLoading: (value: boolean) => void;
  markLessonComplete: () => void;
}

export default function LessonContent({
  course,
  lesson,
  activeModule,
  activeLesson,
  setActiveModule,
  setActiveLesson,
  setNotes,
  setVideoError,
  setIsVideoLoading,
  markLessonComplete,
}: LessonContentProps) {
  const handleMarkComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("LessonContent: Marking lesson complete", {
      lessonId: lesson?.id,
      lessonTitle: lesson?.title,
    });
    markLessonComplete();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("LessonContent: Navigating to previous lesson");
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1);
      setNotes(
        course.modules[activeModule].lessons[activeLesson - 1].progress.notes ||
          ""
      );
      setVideoError(null);
      setIsVideoLoading(true);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
      setNotes(
        course.modules[activeModule - 1].lessons[
          course.modules[activeModule - 1].lessons.length - 1
        ].progress.notes || ""
      );
      setVideoError(null);
      setIsVideoLoading(true);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("LessonContent: Navigating to next lesson");
    if (activeLesson < course.modules[activeModule].lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
      setNotes(
        course.modules[activeModule].lessons[activeLesson + 1].progress.notes ||
          ""
      );
      setVideoError(null);
      setIsVideoLoading(true);
    } else if (activeModule < course.modules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveLesson(0);
      setNotes(
        course.modules[activeModule + 1].lessons[0].progress.notes || ""
      );
      setVideoError(null);
      setIsVideoLoading(true);
    }
  };

  if (!lesson) {
    return <div className="p-4">No lesson selected.</div>;
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">{lesson.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Badge variant="outline" className="flex items-center">
              {lesson.type === "VIDEO" ? (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </>
              ) : lesson.type === "TEXT" ? (
                <>
                  <FileText className="h-3 w-3 mr-1" />
                  Article
                </>
              ) : lesson.type === "QUIZ" ? (
                <>
                  <FileQuestion className="h-3 w-3 mr-1" />
                  Quiz
                </>
              ) : lesson.type === "ASSIGNMENT" ? (
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
              {lesson.duration
                ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "N/A"}
            </Badge>
            {lesson.isPreview && (
              <Badge variant="secondary" className="flex items-center">
                Preview
              </Badge>
            )}
          </div>
          {lesson.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {lesson.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={activeLesson === 0 && activeModule === 0}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={handleMarkComplete}
            disabled={lesson.progress.completed}
          >
            {lesson.progress[0].completed
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
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="ai-quiz">AI Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-4 border rounded-md mt-4">
          <div className="prose max-w-none">
            <h3>Lesson Overview</h3>
            {lesson.description ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.description}
              </ReactMarkdown>
            ) : (
              <p>No description available.</p>
            )}
            <h4>Learning Objectives</h4>
            <ul>
              <li>Understand the fundamental principles of {course.title}</li>
              <li>Apply theoretical knowledge to practical scenarios</li>
              <li>Develop problem-solving skills through guided exercises</li>
              <li>Build a foundation for advanced topics in future lessons</li>
            </ul>
            <h4>Key Takeaways</h4>
            <p>
              By the end of this lesson, you should be able to confidently
              implement the concepts covered and understand how they fit into
              the broader context of {course.title}.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Supplementary Materials</h3>
            <p className="text-muted-foreground">
              No resources available for this lesson.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Video Transcript</h3>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              <p className="text-muted-foreground">
                Transcript not available for this lesson.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-quiz" className="p-4 border rounded-md mt-4">
          <AIGeneratedQuiz courseId={course.id} lessonId={lesson.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Maximize2, Minimize2, Play, Send, X } from "lucide-react";
import { Lesson } from "@/types/my-learning";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { debounce } from "lodash";

interface LessonContentProps {
  lesson: Lesson;
  normalizeYouTubeUrl: (url: string | null) => string | null;
  isValidYouTubeUrl: (url: string | null) => boolean;
  handleProgress: (state: { playedSeconds: number; played: number }) => void;
  courseId?: string;
}

// interface QuizQuestion {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: string;
// }

// interface Assignment {
//   instructions: string;
//   submissionDetails?: {
//     maxFileSize?: number;
//     allowedFileTypes?: string[];
//   };
// }

export default function LessonContent({
  lesson,
  normalizeYouTubeUrl,
  isValidYouTubeUrl,
  handleProgress,
}: LessonContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const { toast } = useToast();

  // const debouncedHandleProgress = useCallback(
  //   debounce((state: { playedSeconds: number; played: number }) => {
  //     handleProgress(state);
  //   }, 15000), // Debounce for 15 seconds
  //   [handleProgress]
  // );

  // Initialize markdown-it
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
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

  const retryVideoLoad = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    setVideoError(null);
    setIsVideoLoading(true);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    if (!lesson?.quiz) return;

    let score = 0;
    lesson.quiz.forEach((question) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    toast({
      title: "Quiz Submitted",
      description: `You scored ${score} out of ${lesson.quiz.length}!`,
    });
  };

  const handleAssignmentSubmit = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    if (!assignmentFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to submit.",
        variant: "destructive",
      });
      return;
    }

    const maxFileSize =
      lesson?.assignment?.submissionDetails?.maxFileSize || 5 * 1024 * 1024; // 5MB default
    const allowedFileTypes = lesson?.assignment?.submissionDetails
      ?.allowedFileTypes || ["application/pdf", "text/plain"];

    if (assignmentFile.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: `File size exceeds ${
          maxFileSize / (1024 * 1024)
        }MB limit.`,
        variant: "destructive",
      });
      return;
    }

    if (!allowedFileTypes.includes(assignmentFile.type)) {
      toast({
        title: "Invalid File Type",
        description: `Allowed file types: ${allowedFileTypes.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully!",
      });
      setAssignmentFile(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    toast({
      title: "Bookmark Saved",
      description: "This lesson has been bookmarked.",
    });
  };

  const normalizedVideoUrl = normalizeYouTubeUrl(lesson?.videoUrl);

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto"
    >
      <div className="p-6">
        {lesson?.type === "VIDEO" ? (
          lesson.videoUrl ? (
            <>
              {isVideoLoading && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-lg animate-pulse">
                    Loading video...
                  </div>
                </div>
              )}
              {videoError ? (
                <div
                  className="text-center text-white p-6 bg-black"
                  aria-live="polite"
                >
                  <X
                    className="h-16 w-16 mx-auto mb-4 text-red-500"
                    aria-hidden="true"
                  />
                  <p className="text-lg font-medium mb-4">{videoError}</p>
                  {isValidYouTubeUrl(lesson.videoUrl) && (
                    <p className="text-sm text-gray-300 mb-4">
                      The video plays on YouTube but not here, likely due to
                      embedding restrictions. If you own the video,{" "}
                      <a
                        href="https://support.google.com/youtube/answer/171780?hl=en#zippy=%2Cembed-a-video-or-playlist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary"
                      >
                        enable embedding
                      </a>{" "}
                      in YouTube Studio.
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={retryVideoLoad}
                      variant="outline"
                      className="text-white border-white/50 hover:bg-white/20"
                      type="button" // Prevent form submission
                    >
                      Retry
                    </Button>
                    {isValidYouTubeUrl(lesson.videoUrl) && (
                      <Button
                        asChild
                        variant="outline"
                        className="text-white border-white/50 hover:bg-white/20"
                        type="button" // Prevent form submission
                      >
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in YouTube
                        </a>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      className="text-white border-white/50 hover:bg-white/20"
                      type="button" // Prevent form submission
                    >
                      <Link href="/support">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}
                >
                  <ReactPlayer
                    ref={playerRef}
                    url={normalizedVideoUrl || lesson.videoUrl}
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                    controls
                    playing={true}
                    onProgress={undefined}
                    onError={(e: any, data: any) => {
                      console.error("Video playback error:", {
                        error: e,
                        data,
                        originalUrl: lesson.videoUrl,
                        normalizedUrl: normalizedVideoUrl,
                      });
                      setIsVideoLoading(false);
                      setVideoError(
                        isValidYouTubeUrl(lesson.videoUrl)
                          ? "Cannot play YouTube video. Embedding may be disabled by the video owner or the video is restricted."
                          : "Failed to load video. The link may be broken or unsupported."
                      );
                      toast({
                        title: "Video Error",
                        description:
                          "Unable to play the video. Please try again or contact support.",
                        variant: "destructive",
                      });
                    }}
                    onReady={() => {
                      console.log(
                        "Video ready:",
                        normalizedVideoUrl || lesson.videoUrl
                      );
                      setIsVideoLoading(false);
                      if (
                        playerRef.current &&
                        Array.isArray(lesson.progress) &&
                        lesson.progress.length > 0 &&
                        lesson.progress[0].lastPosition
                      ) {
                        playerRef.current.seekTo(
                          lesson.progress[0].lastPosition,
                          "seconds"
                        );
                      }
                    }}
                    onBuffer={() => {
                      console.log(
                        "Video buffering:",
                        normalizedVideoUrl || lesson.videoUrl
                      );
                      setIsVideoLoading(true);
                    }}
                    onBufferEnd={() => {
                      console.log(
                        "Video buffer ended:",
                        normalizedVideoUrl || lesson.videoUrl
                      );
                      setIsVideoLoading(false);
                    }}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                      youtube: {
                        playerVars: {
                          rel: 0,
                          showinfo: 0,
                          modestbranding: 1,
                          fs: 1,
                          iv_load_policy: 3,
                          autoplay: 1,
                          origin: window.location.origin,
                        },
                        embedOptions: {
                          host: "https://www.youtube-nocookie.com",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-6">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
              <p className="text-lg font-medium mb-4">
                No video available for this lesson
              </p>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
                type="button" // Prevent form submission
              >
                <Link href="#content">View Lesson Content</Link>
              </Button>
            </div>
          )
        ) : lesson?.type === "TEXT" ? (
          <div className="prose max-w-none">
            {lesson.content ? (
              <div className="text-gray-800 prose-headings:font-semibold prose-p:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4">
                <MdEditor
                  value={lesson.content}
                  style={{ height: "auto", minHeight: "200px" }}
                  renderHTML={(text) => md.render(text)}
                  view={{ menu: false, md: false, html: true }}
                  readOnly
                />
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-600">
                No text content available for this lesson.
              </p>
            )}
          </div>
        ) : lesson?.type === "QUIZ" ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Quiz</h2>
            {lesson.quiz && lesson.quiz.length > 0 ? (
              <>
                {lesson.quiz.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="text-lg font-medium">{question.question}</h3>
                    <RadioGroup
                      onValueChange={(value) =>
                        handleQuizAnswer(question.id, value)
                      }
                      disabled={quizSubmitted}
                      value={quizAnswers[question.id] || ""}
                    >
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${index}`}
                          />
                          <Label htmlFor={`${question.id}-${index}`}>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {quizSubmitted && (
                      <p className="text-sm">
                        {quizAnswers[question.id] === question.correctAnswer ? (
                          <span className="text-green-600">Correct!</span>
                        ) : (
                          <span className="text-red-600">
                            Incorrect. Correct answer: {question.correctAnswer}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
                {!quizSubmitted ? (
                  <Button
                    onClick={submitQuiz}
                    disabled={
                      Object.keys(quizAnswers).length !== lesson.quiz.length
                    }
                    type="button" // Prevent form submission
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <p className="text-lg font-semibold">
                    Your score: {quizScore} / {lesson.quiz.length}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-medium text-gray-600">
                No quiz questions available for this lesson.
              </p>
            )}
          </div>
        ) : lesson?.type === "ASSIGNMENT" ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Assignment</h2>
            {lesson.assignment ? (
              <>
                <div className="prose max-w-none text-gray-800 prose-headings:font-semibold prose-p:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4">
                  <MdEditor
                    value={lesson.assignment.instructions}
                    style={{ height: "auto", minHeight: "200px" }}
                    renderHTML={(text) => md.render(text)}
                    view={{ menu: false, md: false, html: true }}
                    readOnly
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="assignment-file">Upload Submission</Label>
                  <Input
                    id="assignment-file"
                    type="file"
                    onChange={(e) =>
                      setAssignmentFile(e.target.files?.[0] || null)
                    }
                    disabled={false}
                  />
                  {lesson.assignment.submissionDetails && (
                    <p className="text-sm text-gray-600">
                      Max file size:{" "}
                      {(lesson.assignment.submissionDetails.maxFileSize ||
                        5 * 1024 * 1024) /
                        (1024 * 1024)}
                      MB
                      <br />
                      Allowed file types:{" "}
                      {(
                        lesson.assignment.submissionDetails
                          .allowedFileTypes || ["application/pdf", "text/plain"]
                      ).join(", ")}
                    </p>
                  )}
                  <Button
                    onClick={handleAssignmentSubmit}
                    disabled={!assignmentFile}
                    type="button" // Prevent form submission
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Submit Assignment
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-lg font-medium text-gray-600">
                No assignment details available for this lesson.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-lg font-medium text-gray-600">
              Content not available for this lesson
            </p>
          </div>
        )}
      </div>

      {lesson?.type === "VIDEO" && !videoError && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70"
            onClick={handleBookmark}
            type="button" // Prevent form submission
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70"
            onClick={toggleFullscreen}
            type="button" // Prevent form submission
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import ReactPlayer from "react-player";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { CourseTabs } from "./CourseTabs";

interface CourseContentProps {
  currentLesson: any;
  course: any;
  activeModule: number;
  activeLesson: number;
  setActiveModule: (value: number) => void;
  setActiveLesson: (value: number) => void;
  markLessonComplete: () => void;
  showSidebar: boolean;
}

export function CourseContent({
  currentLesson,
  course,
  activeModule,
  activeLesson,
  setActiveModule,
  setActiveLesson,
  markLessonComplete,
  showSidebar,
}: CourseContentProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const { toast } = useToast();

  const normalizeYouTubeUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      return url;
    } catch (err) {
      console.error("Error normalizing YouTube URL:", err);
      return url;
    }
  };

  const isValidYouTubeUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return regex.test(url);
    } catch {
      return false;
    }
  };

  const retryVideoLoad = () => {
    setVideoError(null);
    setIsVideoLoading(true);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
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
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          watchedSeconds,
          lastPosition,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Progress update failed:", errorData);
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const normalizedVideoUrl = normalizeYouTubeUrl(currentLesson?.videoUrl);

  return (
    <div
      className={
        showSidebar ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"
      }
    >
      <div
        ref={videoContainerRef}
        className="relative bg-black rounded-lg overflow-hidden shadow-lg"
      >
        <div className="aspect-video flex items-center justify-center">
          {currentLesson?.type === "VIDEO" ? (
            currentLesson.videoUrl ? (
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
                    className="text-center text-white p-6"
                    aria-live="polite"
                  >
                    <p className="text-lg font-medium mb-4">{videoError}</p>
                    {isValidYouTubeUrl(currentLesson.videoUrl) && (
                      <p className="text-sm text-gray-300 mb-4">
                        The video plays on YouTube but not here, likely due to
                        embedding restrictions.
                      </p>
                    )}
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={retryVideoLoad}
                        variant="outline"
                        className="text-white border-white/50 hover:bg-white/20"
                      >
                        Retry
                      </Button>
                      {isValidYouTubeUrl(currentLesson.videoUrl) && (
                        <Button
                          asChild
                          variant="outline"
                          className="text-white border-white/50 hover:bg-white/20"
                        >
                          <a
                            href={currentLesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open in YouTube
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <ReactPlayer
                    ref={playerRef}
                    url={normalizedVideoUrl || currentLesson.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    onProgress={handleProgress}
                    onError={(e: any, data: any) => {
                      setIsVideoLoading(false);
                      setVideoError(
                        isValidYouTubeUrl(currentLesson.videoUrl)
                          ? "Cannot play YouTube video. Embedding may be disabled."
                          : "Failed to load video."
                      );
                      toast({
                        title: "Video Error",
                        description: "Unable to play the video.",
                        variant: "destructive",
                      });
                    }}
                    onReady={() => {
                      setIsVideoLoading(false);
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
                    onBuffer={() => setIsVideoLoading(true)}
                    onBufferEnd={() => setIsVideoLoading(false)}
                    config={{
                      youtube: {
                        playerVars: {
                          rel: 0,
                          showinfo: 0,
                          modestbranding: 1,
                          autoplay: 1,
                        },
                        embedOptions: {
                          host: "https://www.youtube-nocookie.com",
                        },
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <div className="text-center text-white p-6">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                <p className="text-lg font-medium mb-4">
                  No video available for this lesson
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="text-white border-white/50 hover:bg-white/20"
                >
                  <Link href="#content">View Lesson Content</Link>
                </Button>
              </div>
            )
          ) : (
            <div className="text-center text-white">
              <p className="text-lg font-medium">
                Content not available for this lesson
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold">{currentLesson?.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{currentLesson?.type}</span>
              <span>
                {currentLesson?.duration
                  ? `${Math.floor(currentLesson.duration / 60)}:${(
                      currentLesson.duration % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "N/A"}
              </span>
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
                    course.modules[activeModule - 1].lessons.length - 1
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
                } else if (activeModule < course.modules.length - 1) {
                  setActiveModule(activeModule + 1);
                  setActiveLesson(0);
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>

        <CourseTabs currentLesson={currentLesson} courseTitle={course.title} />
      </div>
    </div>
  );
}

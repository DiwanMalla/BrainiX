"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Maximize2, Minimize2, Play, X } from "lucide-react";
import { Lesson } from "@/app/my-learning/[slug]/page";

interface VideoPlayerProps {
  lesson: Lesson | undefined;
  normalizeYouTubeUrl: (url: string | null) => string | null;
  isValidYouTubeUrl: (url: string | null) => boolean;
  handleProgress: (state: { playedSeconds: number; played: number }) => void;
}

export default function VideoPlayer({
  lesson,
  normalizeYouTubeUrl,
  isValidYouTubeUrl,
  handleProgress,
}: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const { toast } = useToast();

  const toggleFullscreen = () => {
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

  const retryVideoLoad = () => {
    setVideoError(null);
    setIsVideoLoading(true);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  const normalizedVideoUrl = normalizeYouTubeUrl(lesson?.videoUrl);

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-lg"
    >
      <div className="aspect-video flex items-center justify-center">
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
                <div className="text-center text-white p-6" aria-live="polite">
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
                    >
                      Retry
                    </Button>
                    {isValidYouTubeUrl(lesson.videoUrl) && (
                      <Button
                        asChild
                        variant="outline"
                        className="text-white border-white/50 hover:bg-white/20"
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
                    >
                      <Link href="/support">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <ReactPlayer
                  ref={playerRef}
                  url={normalizedVideoUrl || lesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing={true}
                  onProgress={handleProgress}
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
                    if (playerRef.current && lesson.progress.lastPosition) {
                      playerRef.current.seekTo(
                        lesson.progress.lastPosition,
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

      {lesson?.type === "VIDEO" && !videoError && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70"
            onClick={() => {
              toast({
                title: "Bookmark Saved",
                description: "This lesson has been bookmarked.",
              });
            }}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/50 hover:bg-black/70"
            onClick={toggleFullscreen}
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

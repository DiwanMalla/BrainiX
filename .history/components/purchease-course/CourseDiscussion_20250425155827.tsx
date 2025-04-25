"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ThumbsUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseDiscussionProps {
  slug: string;
  showChat: boolean;
  setShowChat: (value: boolean) => void;
  chatMessage: string;
  setChatMessage: (value: string) => void;
  sendChatMessage: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  likes: number;
  isInstructor?: boolean;
}

export default function CourseDiscussion({
  slug,
  showChat,
  setShowChat,
  chatMessage,
  setChatMessage,
  sendChatMessage,
}: CourseDiscussionProps) {
  const [activeIntake, setActiveIntake] = useState("current");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  console.log(slug);
  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/courses/${slug}/messages?intake=${activeIntake}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(
          data.map((msg: any) => ({
            id: msg.id,
            user: msg.sender.name,
            avatar:
              msg.sender.image || msg.sender.name.slice(0, 2).toUpperCase(),
            message: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            likes: msg.likes,
            isInstructor: msg.sender.role === "INSTRUCTOR",
          }))
        );
      } catch (err: any) {
        setError(err.message || "Error loading messages");
        toast({
          title: "Error",
          description: err.message || "Unable to load messages.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [slug, activeIntake, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Subscribe to Pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`course-${slug}`);
    channel.bind("new-message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [slug]);

  // Like message
  const likeMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like message");
      }
      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, likes: updatedMessage.likes } : msg
        )
      );
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Unable to like message.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/50 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Course Discussion</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>24 online</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span>156 total students</span>
          </div>
          <Tabs
            defaultValue="current"
            className="mt-3"
            onValueChange={setActiveIntake}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Intake</TabsTrigger>
              <TabsTrigger value="previous">Previous Intake</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[300px] p-4" ref={scrollAreaRef}>
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading messages...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No messages yet. Start the discussion!
            </p>
          ) : (
            <div className="space-y-4">
              {activeIntake === "current" ? (
                messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar
                      className={
                        msg.isInstructor ? "border-2 border-primary" : ""
                      }
                    >
                      <AvatarFallback>{msg.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{msg.user}</span>
                        {msg.isInstructor && (
                          <Badge
                            variant="outline"
                            className="text-primary border-primary text-xs"
                          >
                            Instructor
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <p className="mt-1">{msg.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeMessage(msg.id)}
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {msg.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                          disabled
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 bg-muted/30 rounded-md text-sm">
                    <p className="text-muted-foreground">
                      This is an archive of discussions from the previous course
                      intake. You can read these messages but cannot reply to
                      them.
                    </p>
                  </div>
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar
                        className={
                          msg.isInstructor ? "border-2 border-primary" : ""
                        }
                      >
                        <AvatarFallback>{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{msg.user}</span>
                          {msg.isInstructor && (
                            <Badge
                              variant="outline"
                              className="text-primary border-primary text-xs"
                            >
                              Instructor
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {msg.time}
                          </span>
                        </div>
                        <p className="mt-1">{msg.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="text-xs text-muted-foreground">
                            <ThumbsUp className="h-3 w-3 inline mr-1" />
                            {msg.likes} likes
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {activeIntake === "current" && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <Button onClick={sendChatMessage} disabled={!chatMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

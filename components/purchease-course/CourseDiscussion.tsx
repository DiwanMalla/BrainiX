"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ThumbsUp, X } from "lucide-react";

interface CourseDiscussionProps {
  showChat: boolean;
  setShowChat: (value: boolean) => void;
  chatMessage: string;
  setChatMessage: (value: string) => void;
  sendChatMessage: () => void;
}

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  likes: number;
  isInstructor?: boolean;
}

export default function CourseDiscussion({
  showChat,
  setShowChat,
  chatMessage,
  setChatMessage,
  sendChatMessage,
}: CourseDiscussionProps) {
  const [activeIntake, setActiveIntake] = useState("current");

  const currentIntakeMessages: ChatMessage[] = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "SJ",
      message: "Has anyone completed the challenge from lesson 3?",
      time: "10:45 AM",
      likes: 3,
    },
    {
      id: 2,
      user: "David Chen",
      avatar: "DC",
      message:
        "Yes, I found it challenging but rewarding. The key is to focus on the algorithm efficiency.",
      time: "10:52 AM",
      likes: 5,
    },
    {
      id: 3,
      user: "Instructor",
      avatar: "IN",
      message:
        "Great discussion everyone! Remember to check the additional resources I posted for more practice.",
      time: "11:05 AM",
      likes: 8,
      isInstructor: true,
    },
    {
      id: 4,
      user: "Miguel Santos",
      avatar: "MS",
      message:
        "I'm stuck on the second part. Can someone explain how to implement the recursive function?",
      time: "11:15 AM",
      likes: 0,
    },
    {
      id: 5,
      user: "Emma Wilson",
      avatar: "EW",
      message:
        "@Miguel - I can help! The trick is to define your base case correctly. Let me share my approach...",
      time: "11:20 AM",
      likes: 2,
    },
  ];

  const previousIntakeMessages: ChatMessage[] = [
    {
      id: 1,
      user: "Alex Taylor",
      avatar: "AT",
      message:
        "This course has been incredibly helpful for my career transition.",
      time: "Mar 15",
      likes: 12,
    },
    {
      id: 2,
      user: "Priya Patel",
      avatar: "PP",
      message:
        "The project in module 4 was challenging but really improved my skills.",
      time: "Mar 16",
      likes: 8,
    },
    {
      id: 3,
      user: "Instructor",
      avatar: "IN",
      message:
        "Thank you all for your participation in this cohort! I'm glad to see so many of you applying these concepts in your work.",
      time: "Mar 20",
      likes: 15,
      isInstructor: true,
    },
  ];

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

        <ScrollArea className="h-[300px] p-4">
          {activeIntake === "current" ? (
            <div className="space-y-4">
              {currentIntakeMessages.map((msg) => (
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
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {msg.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-md text-sm">
                <p className="text-muted-foreground">
                  This is an archive of discussions from the previous course
                  intake. You can read these messages but cannot reply to them.
                </p>
              </div>
              {previousIntakeMessages.map((msg) => (
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
              <Button onClick={sendChatMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

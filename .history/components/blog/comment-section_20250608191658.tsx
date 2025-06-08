"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/blog/utils";
import type { Comment } from "@/lib/blog/type";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Reply } from "lucide-react";

export function CommentSection({
  blogId,
  comments: initialComments,
}: {
  blogId: string;
  comments: Comment[];
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  // Fetch comments after submission
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/${blogId}`);
      if (!response.ok) throw new Error("Failed to fetch blog post");
      const { post } = await response.json();
      setComments(post.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blog/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add comment");
      }

      setNewComment("");
      await fetchComments();
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a reply.",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/blog/${blogId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent.trim() }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add reply");
      }

      setReplyingTo(null);
      setReplyContent("");
      await fetchComments();
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* Add Comment Form */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Join the conversation</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={
              isSignedIn ? "Share your thoughts..." : "Sign in to comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24 resize-none"
            disabled={!isSignedIn}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting || !isSignedIn}
              className="min-w-24"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {comments.filter((c) => c.parentId === null).length === 0 ? (
        <p className="text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments
            .filter((comment) => comment.parentId === null)
            .map((comment) => {
              const replies = comments.filter((r) => r.parentId === comment.id);
              return (
                <Card
                  key={comment.id}
                  className="border-l-4 border-l-primary/20"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={comment.user.image || "/placeholder.svg"}
                              alt={comment.user.name || "User"}
                            />
                            <AvatarFallback>
                              {comment.user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {comment.user.name || "Anonymous"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          #{comments.indexOf(comment) + 1}
                        </Badge>
                      </div>

                      <p className="text-foreground leading-relaxed pl-13">
                        {comment.content}
                      </p>

                      <div className="flex items-center space-x-4 pl-13">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id
                            )
                          }
                          className="h-8 px-2"
                        >
                          <Reply className="mr-1 h-3 w-3" />
                          Reply
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="ml-13 space-y-3 pt-4 border-t">
                          <Textarea
                            placeholder={
                              isSignedIn
                                ? "Write a reply..."
                                : "Sign in to reply..."
                            }
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-20 resize-none"
                            disabled={!isSignedIn}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddReply(comment.id)}
                              disabled={
                                !replyContent.trim() ||
                                isSubmitting ||
                                !isSignedIn
                              }
                            >
                              {isSubmitting ? "Replying..." : "Reply"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="ml-13 space-y-4 pt-4 border-t">
                          {replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start space-x-3"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={reply.user.image || "/placeholder.svg"}
                                  alt={reply.user.name || "User"}
                                />
                                <AvatarFallback className="text-xs">
                                  {reply.user.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-sm">
                                    {reply.user.name || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(reply.createdAt)}
                                  </p>
                                </div>
                                <p className="text-sm text-foreground">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const { post } = await res.json();
      setComments(post.comments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCommentNumber = (id: string) =>
    comments.findIndex((c) => c.id === id) + 1;

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
      const res = await fetch(`/api/blog/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add comment");

      setNewComment("");
      await fetchComments();
      toast({ title: "Comment added" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!isSignedIn || !replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/blog/${blogId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to reply");

      setReplyingTo(null);
      setReplyContent("");
      await fetchComments();
      toast({ title: "Reply posted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">
          Comments{" "}
          <span className="text-muted-foreground">({comments.length})</span>
        </h2>
      </div>

      {/* New Comment */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder={
              isSignedIn
                ? "Write your comment..."
                : "Sign in to leave a comment"
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={!isSignedIn || isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting || !isSignedIn}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comment Thread */}
      <div className="space-y-6">
        {comments.filter((c) => c.parentId === null).length === 0 ? (
          <p className="text-muted-foreground italic">No comments yet.</p>
        ) : (
          comments
            .filter((c) => c.parentId === null)
            .map((comment) => {
              const replies = comments.filter((r) => r.parentId === comment.id);
              return (
                <Card
                  key={comment.id}
                  className="border-l-4 border-primary/30 rounded-lg"
                >
                  <CardContent className="pt-6 space-y-4">
                    {/* Comment Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={
                              comment.author?.profileImageUrl ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {comment.author?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {comment.author?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{getCommentNumber(comment.id)}
                      </Badge>
                    </div>

                    <p className="text-foreground text-sm">{comment.content}</p>

                    <div className="pl-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id
                          )
                        }
                      >
                        <Reply className="h-3 w-3 mr-1" /> Reply
                      </Button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="border-t pt-4 space-y-3">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
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
                      <div className="mt-4 border-t pt-4 space-y-4">
                        {replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="flex items-start gap-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  reply.author?.profileImageUrl ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback className="text-xs">
                                {reply.author?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                  <p className="font-medium">
                                    {reply.author?.name || "Anonymous"}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {formatDate(reply.createdAt)}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  #{getCommentNumber(reply.id)}
                                </Badge>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>

      {/* Flat List View */}
      <div className="border-t pt-8 space-y-2">
        <h3 className="text-base font-semibold">
          All Comments & Replies (flat)
        </h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          {comments.map((c) => (
            <li key={c.id}>
              <span className="font-medium text-foreground">
                {c.author?.name || "Anonymous"}
              </span>{" "}
              ({formatDate(c.createdAt)}) → {c.content}
              {c.parentId && (
                <span className="ml-1 italic text-xs text-gray-500">
                  (in reply to #{getCommentNumber(c.parentId)})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

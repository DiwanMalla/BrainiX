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
import { MessageSquare, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showFlatList, setShowFlatList] = useState(false);
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
      toast({ title: "Comment posted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post comment",
        variant: "destructive",
      });
      console.error("Error posting comment:", error);
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
      toast({ title: "Reply posted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post reply",
        variant: "destructive",
      });
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">
          Discussion{" "}
          <span className="text-muted-foreground text-xl">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* New Comment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6 space-y-4">
            <Textarea
              placeholder={
                isSignedIn
                  ? "Share your thoughts..."
                  : "Sign in to join the discussion"
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[120px] resize-none rounded-lg border border-input bg-background/50 focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200"
              disabled={!isSignedIn || isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting || !isSignedIn}
                className="bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comment Thread */}
      <div className="space-y-6">
        {comments.filter((c) => c.parentId === null).length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground italic text-center py-8"
          >
            Be the first to comment!
          </motion.p>
        ) : (
          comments
            .filter((c) => c.parentId === null)
            .map((comment) => {
              const replies = comments.filter((r) => r.parentId === comment.id);
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-l-4 border-primary/40 hover:border-primary transition-all duration-200 shadow-md hover:shadow-lg">
                    <CardContent className="pt-6 space-y-4">
                      {/* Comment Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                            <AvatarImage
                              src={
                                comment.author?.profileImageUrl ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {comment.author?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">
                              {comment.author?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          #{getCommentNumber(comment.id)}
                        </Badge>
                      </div>

                      <p className="text-foreground text-base leading-relaxed">
                        {comment.content}
                      </p>

                      <div className="pl-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id
                            )
                          }
                          className="text-primary hover:text-primary/80 hover:bg-primary/5"
                        >
                          <Reply className="h-4 w-4 mr-2" /> Reply
                        </Button>
                      </div>

                      {/* Reply Form */}
                      <AnimatePresence>
                        {replyingTo === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t pt-4 space-y-3"
                          >
                            <Textarea
                              placeholder="Write your reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="min-h-[80px] resize-none rounded-lg border border-input bg-background/50"
                              disabled={!isSignedIn}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                                className="hover:bg-muted/50"
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
                                className="bg-primary hover:bg-primary/90"
                              >
                                {isSubmitting ? "Replying..." : "Post Reply"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Replies */}
                      {replies.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 border-t pt-4 space-y-4"
                        >
                          {replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start gap-3 pl-4 border-l-2 border-primary/20"
                            >
                              <Avatar className="w-10 h-10 ring-1 ring-primary/10">
                                <AvatarImage
                                  src={
                                    reply.author?.profileImageUrl ||
                                    "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback className="bg-primary/5 text-primary text-xs">
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
                                <p className="text-sm leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
        )}
      </div>

      {/* Flat List View */}
      <div className="border-t pt-8 space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setShowFlatList(!showFlatList)}
        >
          <span>All Comments & Replies (flat view)</span>
          {showFlatList ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <AnimatePresence>
          {showFlatList && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 text-sm text-muted-foreground"
            >
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {c.author?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({formatDate(c.createdAt)})
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{getCommentNumber(c.id)}
                    </Badge>
                  </div>
                  <p className="text-foreground mt-1">{c.content}</p>
                  {c.parentId && (
                    <span className="text-xs text-muted-foreground italic mt-1">
                      (in reply to #{getCommentNumber(c.parentId)})
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

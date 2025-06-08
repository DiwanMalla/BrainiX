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
import {
  MessageSquare,
  Reply,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentItemProps {
  comment: Comment;
  level?: number;
  comments: Comment[];
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  isSubmitting: boolean;
  handleAddReply: (commentId: string) => Promise<void>;
  expandedReplies: string[];
  toggleReplies: (commentId: string) => void;
}

function CommentItem({
  comment,
  level = 0,
  comments,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  isSubmitting,
  handleAddReply,
  expandedReplies,
  toggleReplies,
}: CommentItemProps) {
  const isRepliesExpanded = expandedReplies.includes(comment.id);
  const replyCount = comment.replies?.length;
  const getCommentNumber = (id: string) =>
    comments.findIndex((c) => c.id === id) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card
        className={`border-0 border-l-4 border-primary/${
          40 - level * 10
        } hover:border-primary transition-all duration-200 shadow-md hover:shadow-xl group-hover:-translate-y-1 ml-${
          level * 4
        }`}
      >
        <CardContent className="pt-6 space-y-4">
          {/* Comment Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-background">
                <AvatarImage src={comment.user?.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {comment.user?.name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              #{getCommentNumber(comment.id)}
            </Badge>
          </div>

          <p className="text-foreground text-base leading-relaxed">
            {comment.content}
          </p>

          <div className="flex items-center gap-2 pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="text-primary hover:text-primary/80 hover:bg-primary/5"
            >
              <Reply className="h-4 w-4 mr-2" /> Reply
            </Button>
            {replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                <CornerDownRight className="h-4 w-4 mr-2" />
                {isRepliesExpanded
                  ? `Hide ${replyCount} ${
                      replyCount === 1 ? "Reply" : "Replies"
                    }`
                  : `Show ${replyCount} ${
                      replyCount === 1 ? "Reply" : "Replies"
                    }`}
              </Button>
            )}
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
                  placeholder={`Reply to @${
                    comment.user?.name || "Anonymous"
                  }...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] resize-none rounded-lg border border-input bg-background/50"
                  disabled={isSubmitting}
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
                    disabled={!replyContent.trim() || isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Replying..." : "Post Reply"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {replyCount > 0 && (
            <AnimatePresence>
              {isRepliesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 border-t pt-4 space-y-4 bg-muted/20 rounded-b-lg"
                >
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      level={level + 1}
                      comments={comments}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyContent={replyContent}
                      setReplyContent={setReplyContent}
                      isSubmitting={isSubmitting}
                      handleAddReply={handleAddReply}
                      expandedReplies={expandedReplies}
                      toggleReplies={toggleReplies}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

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
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const { post } = await res.json();
      setComments(post.comments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      });
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
      setExpandedReplies((prev) =>
        prev.includes(commentId) ? prev : [...prev, commentId]
      );
      toast({ title: "Reply posted successfully" });
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

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const flattenComments = (comments: Comment[]): Comment[] => {
    const flattened: Comment[] = [];
    const traverse = (comment: Comment) => {
      flattened.push(comment);
      comment.replies.forEach(traverse);
    };
    comments.filter((c) => c.parentId === null).forEach(traverse);
    return flattened;
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
        className="group"
      >
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
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
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                comments={comments}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                isSubmitting={isSubmitting}
                handleAddReply={handleAddReply}
                expandedReplies={expandedReplies}
                toggleReplies={toggleReplies}
              />
            ))
        )}
      </div>

      {/* Flat List View */}
      <div className="border-t pt-8 space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between shadow-md hover:shadow-lg transition-all duration-200"
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
              {flattenComments(comments).map((c, index) => {
                const nestingLevel = comments.reduce((level, comment) => {
                  let current = comment;
                  let depth = 0;
                  while (current.parentId) {
                    depth++;
                    current = comments.find((p) => p.id === current.parentId)!;
                  }
                  return c.id === comment.id ? Math.max(level, depth) : level;
                }, 0);
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {c.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({formatDate(c.createdAt)})
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{getCommentNumber(c.id)}
                      </Badge>
                    </div>
                    <p
                      className="text-foreground mt-1"
                      style={{ marginLeft: `${nestingLevel * 1.5}rem` }}
                    >
                      {c.parentId && (
                        <>
                          <CornerDownRight className="inline h-4 w-4 text-primary/80 mr-1" />
                          <span className="text-primary/80 font-medium">
                            @
                            {comments.find((p) => p.id === c.parentId)?.user
                              ?.name || "Anonymous"}
                            :{" "}
                          </span>
                        </>
                      )}
                      {c.content}
                    </p>
                    {c.parentId && (
                      <span
                        className="text-xs text-muted-foreground italic mt-1"
                        style={{ marginLeft: `${nestingLevel * 1.5}rem` }}
                      >
                        (in reply to #{getCommentNumber(c.parentId)})
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

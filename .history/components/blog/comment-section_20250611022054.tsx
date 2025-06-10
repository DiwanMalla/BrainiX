"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { formatDate } from "@/lib/blog/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Reply, CornerDownRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type User = {
  id: string;
  name: string;
  image?: string;
  profileImageUrl?: string | null;
};

export type Comment = {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
  likes?: number;
  isAuthor?: boolean;
};

interface CommentItemProps {
  comment: Comment;
  level?: number;
  comments: Comment[];
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  isSubmitting: boolean;
  handleAddReply: (commentId: string, parentComment: Comment) => Promise<void>;
  expandedReplies: string[];
  toggleReplies: (commentId: string) => void;
  maxNestingLevel?: number;
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
  maxNestingLevel = 5,
}: CommentItemProps) {
  const isRepliesExpanded = expandedReplies.includes(comment.id);
  const replyCount = (comment.replies || []).length;
  const canReply = level < maxNestingLevel;

  const truncatedContent =
    comment.content.length > 30
      ? `${comment.content.slice(0, 27)}...`
      : comment.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {level > 0 && (
        <div
          className="absolute top-0 left-0 h-full border-l-2 border-primary/20"
          style={{ marginLeft: `${level * 1.5 - 0.75}rem` }}
        />
      )}
      <Card
        className={`border-0 border-l-4 border-primary/${
          40 - level * 10
        } hover:border-primary transition-all duration-200 shadow-md hover:shadow-xl group-hover:-translate-y-1`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-background">
                <AvatarImage src={comment.user.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {comment.user.name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(new Date(comment.createdAt))}
                </p>
              </div>
            </div>
          </div>

          <p className="text-foreground text-base leading-relaxed">
            {comment.content}
          </p>

          <div className="flex items-center gap-2 pl-2">
            {canReply && (
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
            )}
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

          <AnimatePresence>
            {replyingTo === comment.id && canReply && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t pt-4 space-y-3 bg-muted/10 rounded-lg"
              >
                <div className="text-sm text-muted-foreground italic px-4">
                  Replying to &ldquo;{truncatedContent}&rdquo; by @
                  {comment.user.name || "Anonymous"}
                </div>
                <Textarea
                  placeholder={`Your reply...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] resize-none rounded-lg border border-input bg-background/50 mx-4"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end gap-2 px-4">
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
                    onClick={() => handleAddReply(comment.id, comment)}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Replying..." : "Post Reply"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  {(comment.replies || []).map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={{ ...reply, replies: reply.replies || [] }}
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
                      maxNestingLevel={maxNestingLevel}
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
  const normalizeComment = (c: Comment): Comment => ({
    ...c,
    user: {
      id: c.user?.id || "",
      name: c.user?.name || "Anonymous",
      image: c.user?.image || c.user?.profileImageUrl || undefined,
    },
    replies: Array.isArray(c.replies) ? c.replies.map(normalizeComment) : [],
  });

  const uniqueComments = Array.from(
    new Map(initialComments.map((c) => [c.id, normalizeComment(c)])).values()
  );
  const [comments, setComments] = useState<Comment[]>(uniqueComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  const { toast } = useToast();
  const { user, isSignedIn } = useUser();

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Initialize expandedReplies for comments with replies
  useEffect(() => {
    const commentIdsWithReplies = comments.reduce<string[]>((acc, c) => {
      const traverse = (comment: Comment) => {
        if (comment.replies && comment.replies.length > 0) {
          acc.push(comment.id);
          comment.replies.forEach(traverse);
        }
      };
      traverse(c);
      return acc;
    }, []);
    setExpandedReplies([...new Set(commentIdsWithReplies)]);
  }, [comments]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}?t=${Date.now()}`, {
        cache: "no-cache",
      });
      if (!res.ok) throw new Error(`Failed to fetch blog post: ${res.status}`);
      const { post } = await res.json();
      const uniqueComments = Array.from(
        new Map(
          post.comments.map((c: Comment) => [c.id, normalizeComment(c)])
        ).values()
      );
      setComments([...uniqueComments] as Comment[]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch comments";
      toast({
        title: "Error",
        description: errorMessage,
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

  const handleAddReply = async (commentId: string, parentComment: Comment) => {
    if (!isSignedIn || !replyContent.trim()) return;
    setIsSubmitting(true);

    const optimisticReply: Comment = {
      id: `temp-${Date.now()}`,
      content: replyContent.trim(),
      blogId,
      userId: user?.id || "",
      parentId: commentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: user?.id || "",
        name: user?.fullName || "Anonymous",
        image: user?.imageUrl,
      },
      replies: [],
    };

    setComments((prevComments) => {
      const updateReplies = (comments: Comment[]): Comment[] => {
        return comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies || []), optimisticReply] };
          }
          return { ...c, replies: updateReplies(c.replies || []) };
        });
      };
      return updateReplies([...prevComments]);
    });

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
      setComments((prevComments) => {
        const removeOptimisticReply = (comments: Comment[]): Comment[] => {
          return comments.map((c) => ({
            ...c,
            replies: (c.replies || []).filter(
              (r) => r.id !== optimisticReply.id
            ),
          }));
        };
        return removeOptimisticReply([...prevComments]);
      });
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

  const totalCommentCount = useMemo(
    () => comments.filter((c) => c.parentId === null).length,
    [comments]
  );

  return (
    <section className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 border-b pb-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">
          Discussion{" "}
          <span className="text-muted-foreground text-xl">
            ({totalCommentCount})
          </span>
        </h2>
      </div>

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
                comment={{ ...comment, replies: comment.replies || [] }}
                comments={comments}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                isSubmitting={isSubmitting}
                handleAddReply={handleAddReply}
                expandedReplies={expandedReplies}
                toggleReplies={toggleReplies}
                maxNestingLevel={5}
              />
            ))
        )}
      </div>
    </section>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/blog/utils";
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
  replies: Comment[]; // Ensured non-optional array
  likes?: any[];
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
  const replyCount = comment.replies.length; // Safe since replies is always an array
  const getCommentNumber = (id: string) =>
    comments.findIndex((c) => c.id === id) + 1;
  const canReply = level < maxNestingLevel;

  // Truncate content for reply form context
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
      {/* Connecting line for nested comments */}
      {level > 0 && (
        <div
          className="absolute top-0 left-0 h-full border-l-2 border-primary/20"
          style={{ marginLeft: `${level * 1.5}rem` }}
        />
      )}
      <Card
        className={`border-0 border-l-4 border部队primary/${
          40 - level * 10
        } hover:border-primary transition-all duration-200 shadow-md hover:shadow-xl group-hover:-translate-y-1 ml-${
          level * 6
        }`}
      >
        <CardContent className="pt-6 space-y-4">
          {/* Comment Header */}
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
            <Badge variant="secondary" className="text-xs font-medium">
              #{getCommentNumber(comment.id)}
            </Badge>
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

          {/* Reply Form */}
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
                  Replying to "{truncatedContent}" by @
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
  // Deduplicate comments and ensure replies is an array
  const uniqueComments = Array.from(
    new Map(
      initialComments.map((c) => [
        c.id,
        { ...c, replies: Array.isArray(c.replies) ? c.replies : [] },
      ])
    ).values()
  );
  const [comments, setComments] = useState<Comment[]>(uniqueComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFlatList, setShowFlatList] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const { post } = await res.json();
      // Deduplicate comments and ensure replies is an array
      const uniqueComments = Array.from(
        new Map(
          post.comments.map((c: Comment) => [
            c.id,
            { ...c, replies: Array.isArray(c.replies) ? c.replies : [] },
          ])
        ).values()
      );
      setComments(uniqueComments);
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

  const handleAddReply = async (commentId: string, parentComment: Comment) => {
    if (!isSignedIn || !replyContent.trim()) return;
    setIsSubmitting(true);

    // Optimistic update
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
      return updateReplies(prevComments);
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
      // Rollback optimistic update
      setComments((prevComments) => {
        const removeOptimisticReply = (comments: Comment[]): Comment[] => {
          return comments.map((c) => ({
            ...c,
            replies: (c.replies || []).filter(
              (r) => r.id !== optimisticReply.id
            ),
          }));
        };
        return removeOptimisticReply(prevComments);
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

  // Memoize flattened comments and nesting levels
  const { flattenedComments, nestingLevels, replyChains } = useMemo(() => {
    const flattened: Comment[] = [];
    const levels: Map<string, number> = new Map();
    const chains: Map<string, string> = new Map();

    const traverse = (
      comment: Comment,
      depth: number = 0,
      chain: string[] = []
    ) => {
      flattened.push(comment);
      levels.set(comment.id, depth);
      const currentChain = [
        ...chain,
        `@${comment.user.name || "Anonymous"}`,
      ].join(" → ");
      chains.set(comment.id, currentChain);
      comment.replies?.forEach((reply) =>
        traverse(reply, depth + 1, currentChain.split(" → "))
      );
    };

    comments.filter((c) => c.parentId === null).forEach((c) => traverse(c));
    return {
      flattenedComments: flattened,
      nestingLevels: levels,
      replyChains: chains,
    };
  }, [comments]);

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
                maxNestingLevel={5}
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
              {flattenedComments.map((c, index) => (
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
                        {c.user.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({formatDate(new Date(c.createdAt))})
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{comments.findIndex((com) => com.id === c.id) + 1}
                    </Badge>
                  </div>
                  <p
                    className="text-foreground mt-1"
                    style={{
                      marginLeft: `${nestingLevels.get(c.id)! * 1.5}rem`,
                    }}
                  >
                    {c.parentId && (
                      <>
                        <CornerDownRight className="inline h-4 w-4 text-primary/80 mr-1" />
                        <span className="text-primary/80 font-medium">
                          {replyChains.get(c.id)}:{" "}
                        </span>
                      </>
                    )}
                    {c.content}
                  </p>
                  {c.parentId && (
                    <span
                      className="text-xs text-muted-foreground italic mt-1"
                      style={{
                        marginLeft: `${nestingLevels.get(c.id)! * 1.5}rem`,
                      }}
                    >
                      (in reply to #
                      {comments.findIndex((com) => com.id === c.parentId) + 1})
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

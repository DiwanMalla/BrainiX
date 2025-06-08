"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/blog/utils";
import type { Comment } from "@/lib/blog/type";
import { addComment, addReply } from "@/lib/actions";
import { MessageSquare, Reply, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CommentSection({
  postId,
  comments,
}: {
  postId: string;
  comments: Comment[];
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, newComment);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addReply(postId, commentId, replyContent);
      setReplyingTo(null);
      setReplyContent("");
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
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
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24 resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Card key={comment.id} className="border-l-4 border-l-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.author.avatar || "/placeholder.svg"}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{comment.author.name}</p>
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
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Heart className="mr-1 h-3 w-3" />
                    {Math.floor(Math.random() * 10)}
                  </Button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="ml-13 space-y-3 pt-4 border-t">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-20 resize-none"
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
                        disabled={!replyContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? "Replying..." : "Reply"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-13 space-y-4 pt-4 border-t">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start space-x-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={reply.author.avatar || "/placeholder.svg"}
                            alt={reply.author.name}
                          />
                          <AvatarFallback className="text-xs">
                            {reply.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">
                              {reply.author.name}
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
        ))}
      </div>
    </div>
  );
}

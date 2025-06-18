// Blog Comment Management Page
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, CheckCircle2, XCircle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: { name: string };
  postTitle: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      try {
        const res = await fetch("/api/blog/author/comments");
        if (!res.ok) throw new Error("Failed to fetch comments");
        setComments(await res.json());
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    // TODO: Implement API call to approve comment
    console.log('Approving comment:', id);
  };
  const handleReject = async (id: string) => {
    // TODO: Implement API call to reject comment
    console.log('Rejecting comment:', id);
  };
  const handleDelete = async (id: string) => {
    // TODO: Implement API call to delete comment
    console.log('Deleting comment:', id);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" /> Manage Comments
      </h1>
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-muted-foreground">No comments to moderate.</div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                  {comment.author.name} on{" "}
                  <span className="font-bold">{comment.postTitle}</span>
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-base">{comment.content}</div>
                <div className="flex gap-2">
                  {comment.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(comment.id)}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

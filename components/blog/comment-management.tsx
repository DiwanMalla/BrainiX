// Blog Comment Management Table (Reusable)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: { name: string };
  postTitle: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface CommentManagementProps {
  comments: Comment[];
  loading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CommentManagement({
  comments,
  loading,
  onApprove,
  onReject,
  onDelete,
}: CommentManagementProps) {
  return (
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
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => onApprove?.(comment.id)}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject?.(comment.id)}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete?.(comment.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

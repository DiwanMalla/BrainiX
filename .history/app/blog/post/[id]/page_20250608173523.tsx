import { notFound } from "next/navigation";
import { getPostById } from "@/lib/blog/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, MessageCircle, ThumbsUp } from "lucide-react";
import { getServerSession } from "@clerk/nextjs/server";
import { format } from "date-fns";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  // Await params to resolve the id
  const { id } = await params;

  // Fetch the post by id
  const post = await getPostById(id);

  // Handle post not found
  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Get the current user (for edit button visibility)
  const session = await getServerSession();
  const isAuthor = session?.user?.id === post.authorId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={800}
              height={400}
              className="rounded-t-lg object-cover"
            />
          )}
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {post.publishedAt
                  ? format(new Date(post.publishedAt), "MMM d, yyyy")
                  : "Unpublished"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length} Comments</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes.length} Likes</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {isAuthor && (
            <div className="flex justify-end">
              <Link href={`/edit/${post.id}`}>
                <Button variant="outline">Edit Post</Button>
              </Link>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            {post.comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet.</p>
            ) : (
              post.comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      {comment.user.name || "Anonymous"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

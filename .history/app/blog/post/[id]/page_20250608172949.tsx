import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, getReadingTime } from "@/lib/blog/utils";
import { getPostById } from "@/lib/data";
import { CommentSection } from "@/components/comment-section";
import { ArrowLeft, Edit, Clock, Eye, Share2, Bookmark } from "lucide-react";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to posts
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{post.category || "General"}</Badge>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  <AvatarImage
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                  />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {readingTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {Math.floor(Math.random() * 500) + 50}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/edit/${post.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          </header>

          <Separator />

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6 leading-relaxed text-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <Separator />

          {/* Comments Section */}
          <CommentSection postId={post.id} comments={post.comments} />
        </article>
      </div>
    </div>
  );
}

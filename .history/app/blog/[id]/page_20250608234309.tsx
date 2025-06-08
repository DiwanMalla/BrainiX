"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, getReadingTime } from "@/lib/blog/utils";
import { CommentSection } from "@/components/blog/comment-section";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { ArrowLeft, Edit, Clock, Eye, Share2, Bookmark } from "lucide-react";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type User = {
  id: string;
  name: string;
  image?: string;
  profileImageUrl?: string | null;
};

export type BlogLike = {
  id: string;
  blogId: string;
  userId: string;
  createdAt: string;
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: User; // Made non-optional
  replies: Comment[];
  likes?: BlogLike[];
  isAuthor?: boolean;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  authorId: string;
  author: User;
  tags: string[];
  comments: Comment[];
  likes: BlogLike[];
  totalViews: number;
  createdAt: string;
  updatedAt: string;
};

async function getPostById(
  id: string
): Promise<{ post: Post; isAuthor: boolean } | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const response = await fetch(`${baseUrl}/api/blog/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Deduplicate comments by ID
    const uniqueComments = Array.from(
      new Map(data.post.comments.map((c: Comment) => [c.id, c])).values()
    );
    data.post.comments = uniqueComments;
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await getPostById(params.id);

  if (!data || !data.post) {
    notFound();
  }

  const { post, isAuthor } = data;
  const readingTime = getReadingTime(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to posts
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            {post.thumbnail && (
              <img
                src={post.thumbnail ?? "/placeholder.jpg"}
                alt={post.title}
                width={800}
                height={400}
                loading="lazy"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Assuming useToast is available via context or prop
                    // toast({ title: "Link copied to clipboard!" });
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Placeholder for bookmark functionality
                    // toast({ title: "Bookmarked!" });
                  }}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground italic">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  <AvatarImage
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name || "Author"}
                  />
                  <AvatarFallback>
                    {post.author.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {post.author.name || "Anonymous"}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span>
                      {formatDate(new Date(post.publishedAt ?? Date.now()))}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {readingTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {post.totalViews}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthor && (
                <div className="flex space-x-2">
                  <Link href={`/edit/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <DeletePostButton id={post.id} />
                </div>
              )}
            </div>
          </header>
          <Separator />
          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.trim() ? (
              post.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-6 leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground italic">
                No content available for this post.
              </p>
            )}
          </div>
          <Separator />
          {/* Comments Section */}
          <CommentSection blogId={post.id} comments={post.comments} />
        </article>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, getReadingTime } from "@/lib/blog/utils";
import { CommentSection } from "@/components/blog/comment-section";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { ArrowLeft, Edit, Clock, Eye, Share2, Bookmark } from "lucide-react";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

import type { Post } from "@/lib/blog/type";

interface PageParams {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getPostBySlug(slug: string) {
  try {
    const { userId } = auth();
    
    const post = await prisma.blog.findUnique({
      where: { 
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: true,
            likes: true,
            replies: {
              include: {
                user: true,
                likes: true,
              },
            },
          },
        },
        likes: true,
      },
    });

    if (!post) {
      return null;
    }

    return {
      post: {
        ...post,
        isAuthor: userId === post.authorId,
      },
      isAuthor: userId === post.authorId,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = params;
  if (!slug) {
    notFound();
  }

  const data = await getPostBySlug(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post, isAuthor } = data;
  const readingTime = getReadingTime(post.content);

  // Transform comments to match CommentSection component's expected type
  const transformedComments = post.comments.map((comment) => ({
    ...comment,
    likes: comment.likes?.length ?? 0,
    replies: comment.replies?.map((reply) => ({
      ...reply,
      likes: reply.likes?.length ?? 0,
      replies: [], // We're limiting nesting to one level
    })) ?? [],
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to posts
            </Button>
          </Link>
        </div>

        <article className="space-y-8">
          <header className="space-y-6">
            {post.thumbnail && (
              <div className="relative w-full h-64">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" disabled>
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
                    src={post.author?.image || "/placeholder.svg"}
                    alt={post.author?.name || "Author"}
                  />
                  <AvatarFallback>
                    {post.author?.name?.split(" ").map((n) => n[0]).join("") || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {post.author?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span>{formatDate(new Date(post.createdAt))}</span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {readingTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {post.totalViews || 0}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthor && (
                <div className="flex space-x-2">
                  <Link href={`/blog/edit/${post.id}`}>
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
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6 leading-relaxed text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          
          <Separator />
          
          <CommentSection blogId={post.id} comments={transformedComments} />
        </article>
      </div>
    </div>
  );
}

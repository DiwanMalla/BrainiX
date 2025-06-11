import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { PenTool, TrendingUp, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";

import { type Post } from "@/lib/blog/type";

// Type used for parsing API response
type RawBlogPost = Omit<Post, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

async function getPosts(): Promise<Post[]> {
  try {
    // Construct the absolute URL
    const baseUrl = process.env.VERCEL_URL ? `c` : "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/blog`;

    console.log("Fetching from URL:", apiUrl); // Debug log to verify the URL

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data: RawBlogPost[] = await response.json();

    return data.map(
      (post): Post => ({
        ...post,
        slug: post.slug || post.id,
        status: post.status || "PUBLISHED",
        authorId: post.author?.id || "anonymous",
        updatedAt: post.updatedAt || post.createdAt || new Date().toISOString(),
        createdAt: post.createdAt || new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  const totalComments = posts.reduce(
    (acc, post) => acc + post.comments.length,
    0
  );
  const activeReaders = posts.reduce((acc, post) => acc + post.totalViews, 0);

  return (
    <div className="relative container mx-auto px-4 py-8 space-y-12">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <BackButton />
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-3 py-1">
            <TrendingUp className="mr-1 h-3 w-3" />
            Welcome to BrainiXBlog
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Share Your{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Stories
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing stories, share your thoughts, and connect with a
            community of writers and readers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto">
              <PenTool className="mr-2 h-4 w-4" />
              Start Writing
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Users className="mr-2 h-4 w-4" />
            Join Community
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="text-3xl font-bold text-primary">{posts.length}</div>
          <div className="text-sm text-muted-foreground">Published Posts</div>
        </div>
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="text-3xl font-bold text-primary">{totalComments}</div>
          <div className="text-sm text-muted-foreground">Total Comments</div>
        </div>
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="text-3xl font-bold text-primary">{activeReaders}</div>
          <div className="text-sm text-muted-foreground">Active Readers</div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <p className="text-muted-foreground text-sm">
              Discover the newest stories from our community
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:flex">
            <Clock className="mr-1 h-3 w-3" />
            Recently Updated
          </Badge>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <PenTool className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No posts yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share your story with the community. Your voice
              matters!
            </p>
            <Link href="/create">
              <Button>Create First Post</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={{
                  ...post,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { BlogSearchCard } from "@/components/blog/blog-search-card";
import { BlogFilter } from "@/components/blog/blog-filter";
import { PenTool, TrendingUp } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/theme-toggle";

import { type Post } from "@/lib/blog/type";

// Type used for parsing API response
type RawBlogPost = Omit<Post, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

async function getPosts(filter: string = "recent"): Promise<Post[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/blog?filter=${filter}`, {
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

async function getBlogs(filter: string = "recent") {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: true,
        likes: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: [
        ...(filter === "popular"
          ? [{ totalViews: "desc" }]
          : filter === "trending"
          ? [{ likes: { _count: "desc" } }]
          : filter === "discussed"
          ? [{ comments: { _count: "desc" } }]
          : [{ updatedAt: "desc" }]),
      ],
      take: 20,
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const blogs = await getBlogs(searchParams.filter);

  const totalComments = blogs.reduce(
    (acc, blog) => acc + blog._count.comments,
    0
  );
  const totalViews = blogs.reduce((acc, blog) => acc + blog.totalViews, 0);

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
          <BlogFilter />
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <PenTool className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No posts yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share your story with the community. Your voice
              matters!
            </p>
            <Link href="/blog/create">
              <Button>Create First Post</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogSearchCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

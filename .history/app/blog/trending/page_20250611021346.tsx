import { BlogPostCard } from "@/components/blog/blog-post-card";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/lib/blog/type";
async function getTrendingPosts() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/blog/trending`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trending posts: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
}

export default async function TrendingPage() {
  const trendingPosts = await getTrendingPosts();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-4xl font-bold tracking-tight">Trending Now</h1>
          <Badge variant="secondary" className="h-fit">
            <TrendingUp className="h-4 w-4 mr-1" />
            Hot Topics
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover the most popular and engaging articles trending in our
          community
        </p>
      </div>

      {/* Trending Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingPosts.map((post: BlogPost) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {trendingPosts.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No trending posts yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Check back soon to see what&apos;s trending in our community!
          </p>
        </div>
      )}
    </div>
  );
}

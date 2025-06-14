// Blog Search Results Page
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BlogPostCard = dynamic(
  () => import("@/components/blog/blog-post-card").then((m) => m.BlogPostCard),
  { ssr: false }
);

function BlogPostCardSkeleton() {
  return <div className="animate-pulse rounded-lg bg-muted h-[320px] w-full" />;
}

export default function BlogSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filter, setFilter] = useState("recent");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts when query or filter changes
  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(
      `/api/blog/search?query=${encodeURIComponent(query)}&filter=${filter}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Failed to fetch search results.");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [query, filter]);

  if (!query.trim()) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Search Blog Posts</h1>
          <p className="text-muted-foreground">
            Use the search bar above to find blog articles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            {loading
              ? "Searching..."
              : `Found ${posts.length} results for "${query}"`}
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter results" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="discussed">Most Discussed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogPostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <div className="text-red-500 text-center py-10">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogPostCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}

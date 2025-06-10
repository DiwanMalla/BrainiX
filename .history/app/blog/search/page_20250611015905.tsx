import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchParams {
  q?: string;
  filter?: string;
}

async function searchPosts(query: string, filter: string = "recent") {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(
      `${baseUrl}/api/blog/search?q=${encodeURIComponent(
        query
      )}&filter=${filter}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q || "";
  const filter = searchParams.filter || "recent";
  const posts = query ? await searchPosts(query, filter) : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Search Results</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-8"
              defaultValue={query}
            />
          </div>
          <Select defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Updated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {query ? (
        <>
          <p className="text-muted-foreground">
            Found {posts.length} results for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl font-semibold">No results found</p>
              <p className="text-muted-foreground">
                Try different keywords or filters
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold">Enter a search term</p>
          <p className="text-muted-foreground">
            Search for articles by title, content, or tags
          </p>
        </div>
      )}
    </div>
  );
}

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Button } from "@/components/ui/button";
import { PenTool, FileText } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getUserPosts(
  userId: string,
  status: "published" | "draft" = "published"
) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(
      `${baseUrl}/api/blog/user/${userId}?status=${status}`,
      {
        next: { revalidate: 0 }, // Don't cache user's posts
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user posts: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

export default async function MyPostsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/auth?tab=signin");
  }

  const [publishedPosts, draftPosts] = await Promise.all([
    getUserPosts(userId, "published"),
    getUserPosts(userId, "draft"),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">My Posts</h1>
          <p className="text-lg text-muted-foreground">
            Manage your published posts and drafts
          </p>
        </div>
        <Link href="/blog/create">
          <Button>
            <PenTool className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Posts Tabs */}
      <Tabs defaultValue="published" className="space-y-6">
        <TabsList>
          <TabsTrigger value="published">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-8">
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} showEditButton />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No published posts yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start sharing your thoughts with the community by creating your
                first post.
              </p>
              <Link href="/blog/create">
                <Button>Create First Post</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-8">
          {draftPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {draftPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} showEditButton />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <PenTool className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No drafts</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don&apos;t have any draft posts. Start writing something
                new!
              </p>
              <Link href="/blog/create">
                <Button>Start Writing</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

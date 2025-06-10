import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";
import Link from "next/link";

async function getDrafts(userId: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(
      `${baseUrl}/api/blog/user/${userId}?status=draft`,
      {
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch drafts: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return [];
  }
}

export default async function DraftsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/auth?tab=signin");
  }

  const drafts = await getDrafts(userId);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Drafts</h1>
          <p className="text-lg text-muted-foreground">
            Continue working on your unfinished posts
          </p>
        </div>
        <Link href="/blog/create">
          <Button>
            <PenTool className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Drafts Grid */}
      {drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drafts.map((post) => (
            <BlogPostCard key={post.id} post={post} showEditButton isDraft />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <PenTool className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No drafts</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don&apos;t have any drafts. Start writing something new!
          </p>
          <Link href="/blog/create">
            <Button>Start Writing</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

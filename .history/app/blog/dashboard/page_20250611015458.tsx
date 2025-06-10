import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Eye,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-post-card";

async function getDashboardData(userId: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/blog/dashboard/${userId}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalFollowers: 0,
      },
      recentPosts: [],
      popularPosts: [],
    };
  }
}

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/auth?tab=signin");
  }

  const { stats, recentPosts, popularPosts } = await getDashboardData(userId);

  const statsCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: BookOpen,
      description: "Published articles",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      description: "Article views",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: ThumbsUp,
      description: "Engagement received",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: MessageSquare,
      description: "Reader interactions",
    },
    {
      title: "Followers",
      value: stats.totalFollowers,
      icon: UserCheck,
      description: "Your audience",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Track your content performance and engage with your audience
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">
                Last 30 days
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm font-medium">{stat.title}</p>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent and Popular Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Posts</h2>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>

        {/* Popular Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Popular Posts</h2>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

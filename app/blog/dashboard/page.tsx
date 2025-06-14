// Blog Author Dashboard Page
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, BarChart2, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";

interface Analytics {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalDrafts: number;
}

export default function BlogAuthorDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics from API (replace with your endpoint)
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch("/api/blog/author/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        setAnalytics(await res.json());
      } catch {
        setAnalytics({
          totalPosts: 0,
          totalViews: 0,
          totalComments: 0,
          totalDrafts: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Blog Author Dashboard
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Manage your posts, track analytics, and moderate comments.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/blog/create">
            <Button variant="default" className="flex gap-2 items-center">
              <PenTool className="w-4 h-4" /> New Post
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Posts</CardTitle>
            <BarChart2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : analytics?.totalPosts ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : analytics?.totalViews ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Comments</CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : analytics?.totalComments ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Drafts</CardTitle>
            <PenTool className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : analytics?.totalDrafts ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Link href="/blog/comments">
          <Button variant="outline" className="flex gap-2 items-center">
            <MessageSquare className="w-4 h-4" /> Manage Comments
          </Button>
        </Link>
      </div>
    </div>
  );
}

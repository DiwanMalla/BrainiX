// Blog Analytics Cards (Reusable)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Eye, MessageSquare, PenTool } from "lucide-react";

interface AnalyticsCardsProps {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalDrafts: number;
  loading?: boolean;
}

export function AnalyticsCards({
  totalPosts,
  totalViews,
  totalComments,
  totalDrafts,
  loading,
}: AnalyticsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Total Posts</CardTitle>
          <BarChart2 className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : totalPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Total Views</CardTitle>
          <Eye className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : totalViews}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Comments</CardTitle>
          <MessageSquare className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "-" : totalComments}
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
            {loading ? "-" : totalDrafts}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

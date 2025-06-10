import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/blog/utils";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BlogSearchCardProps = {
  blog: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    thumbnail?: string | null;
    totalViews: number;
    author: {
      name: string | null;
      image?: string | null;
    };
    _count: {
      comments: number;
      likes: number;
    };
    createdAt: string | Date;
  };
};

export function BlogSearchCard({ blog }: BlogSearchCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="aspect-video relative">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No thumbnail</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {blog.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.totalViews}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {blog._count.comments}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {blog._count.likes}
              </span>
            </div>
            <span>{formatDate(new Date(blog.createdAt))}</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-muted">
              {blog.author.image ? (
                <Image
                  src={blog.author.image}
                  alt={blog.author.name || "Author"}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <span className="text-sm font-medium">
              {blog.author.name || "Anonymous"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

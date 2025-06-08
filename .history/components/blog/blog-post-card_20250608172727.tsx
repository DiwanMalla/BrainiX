import Link from "next/link";
import { formatDate, getReadingTime } from "@/lib/blog/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, Eye } from "lucide-react";
import type { Post } from "@/lib/blog/type";

export function BlogPostCard({ post }: { post: Post }) {
  const readingTime = getReadingTime(post.content);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {post.category || "General"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {readingTime} min read
          </div>
        </div>
        <Link href={`/blog/post/${post.id}`}>
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {post.content}
        </p>

        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
            />
            <AvatarFallback className="text-xs font-medium">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            {post.comments.length}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="mr-1 h-4 w-4" />
            {Math.floor(Math.random() * 500) + 50}
          </div>
        </div>
        <Link href={`/blog//post/${post.id}`}>
          <Badge
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Read More
          </Badge>
        </Link>
      </CardFooter>
    </Card>
  );
}

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/blog/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";

import type { Post } from "@/lib/blog/type";

export function BlogPostCard({ post }: { post: Post }) {
  return (
    <Card className="group transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="space-y-4 p-0">
        {post.thumbnail && (
          <div className="relative h-48 w-full">
            <img
              src={post.thumbnail ?? "/placeholder.jpg"}
              alt={post.title}
              className="object-cover rounded-t-lg w-full h-[250px]"
              loading="lazy"
            />
          </div>
        )}
        <div className="px-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Link href={`/blog/post/${post.slug}`}>
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {post.title}
            </h3>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {post.excerpt || "No excerpt available"}
        </p>

        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage
              src={post.author.image || "/placeholder.svg"}
              alt={post.author.name || "Author"}
            />
            <AvatarFallback className="text-xs font-medium">
              {post.author.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {post.author.name || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/20 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            {post.comments.length}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="mr-1 h-4 w-4" />
            {post.totalViews}
          </div>
        </div>
        <Link href={`/blog/post/${post.slug}`}>
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

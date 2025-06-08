"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, ArrowLeft, HelpCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
}

export function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await fetch(
        post?.id ? `/api/blog/${post.id}` : "/api/blog",
        {
          method: post?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            excerpt: excerpt.trim() || undefined,
            thumbnail: thumbnail.trim() || undefined,
            tags: tagArray,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save post.");
      }

      const { id } = await response.json();
      toast({
        title: `Post ${post?.id ? "updated" : "created"}`,
        description: `Your blog post has been ${
          post?.id ? "updated" : "published"
        } successfully.`,
      });

      router.push(`/blog/${id || post?.id}`);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">
              {post?.id ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-muted-foreground">
              Share your story with the world
            </p>
          </div>
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Write Your Post</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {isPreview ? "Edit" : "Preview"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isPreview ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[400px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail</Label>
                      <div className="flex gap-2">
                        <Input
                          id="thumbnail"
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUploadClick}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting
                          ? post?.id
                            ? "Updating..."
                            : "Publishing..."
                          : post?.id
                          ? "Update Post"
                          : "Publish Post"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        {thumbnail && (
                          <img
                            src={thumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                        <CardTitle className="text-3xl font-bold">
                          {title || "Your Title"}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {user?.fullName || "You"}</span>
                          <span>{format(new Date(), "MMM d, yyyy")}</span>
                        </div>
                        {tags.split(",").map((tag) =>
                          tag.trim() ? (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="mr-2"
                            >
                              {tag.trim()}
                            </Badge>
                          ) : null
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {excerpt && <p className="italic">{excerpt}</p>}
                        <div className="prose max-w-none">
                          {content.split("\n\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Visibility</span>
                  <Badge variant="outline">Public</Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Category</span>
                  <Badge>General</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Start with a compelling hook</p>
                <p>Use clear, concise language</p>
                <p>Break up text with paragraphs</p>
                <p>End with a strong conclusion</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use This Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {post?.id ? "Edit Post" : "Create a Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Fill out the form to publish your blog post.</p>
              <p>Use Preview to check how it will look.</p>
              <p>Click "Upload Image" to attach a thumbnail (coming soon).</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Coming Soon Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Image Upload - Coming Soon</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>We're working on this feature.</p>
              <p>For now, paste a valid image URL into the thumbnail field.</p>
              <p className="text-yellow-600">
                🚧 Upload functionality coming soon!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

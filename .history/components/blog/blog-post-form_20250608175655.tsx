"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, ArrowLeft, HelpCircle } from "lucide-react";
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
  tags?: string[];
}

export function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

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

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt.trim() || undefined,
          tags: tagArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const { id } = await response.json();
      toast({
        title: "Post created",
        description: "Your blog post has been published successfully.",
      });
      router.push(`/blog/post/${id}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your story with the world
            </p>
          </div>
          <Link href="/">
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
                        placeholder="Enter an engaging title..."
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A brief summary of your post..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your story..."
                        className="min-h-[400px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Comma-separated tags (e.g., tech, coding)"
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
                        {isSubmitting ? "Publishing..." : "Publish Post"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-3xl font-bold">
                          {title || "Your Title"}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>By You</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{format(new Date(), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        {tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="mr-2"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {excerpt && (
                          <p className="text-muted-foreground italic">
                            {excerpt || "No excerpt provided"}
                          </p>
                        )}
                        <div className="prose max-w-none">
                          {content.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="mb-4">
                              {paragraph || "No content yet"}
                            </p>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Visibility
                  </span>
                  <Badge variant="outline">Public</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
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

        {/* User Guide Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use This Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Guide: Creating a Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <h3 className="font-semibold">Steps to Create a Post</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Title</strong>: Enter a catchy title for your post.
                  It’s the first thing readers see!
                </li>
                <li>
                  <strong>Excerpt</strong>: Provide a brief summary (optional)
                  to entice readers.
                </li>
                <li>
                  <strong>Content</strong>: Write your story in the content
                  area. Use paragraphs to keep it readable.
                </li>
                <li>
                  <strong>Tags</strong>: Add comma-separated tags (e.g., tech,
                  coding) to categorize your post.
                </li>
                <li>
                  <strong>Preview</strong>: Click the “Preview” button to see
                  how your post will look when published.
                </li>
                <li>
                  <strong>Publish</strong>: Click “Publish Post” to share your
                  post with the community. You must be signed in.
                </li>
                <li>
                  <strong>Cancel</strong>: Use the “Cancel” button to discard
                  changes or go back.
                </li>
              </ul>
              <h3 className="font-semibold">Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep your title under 60 characters for SEO.</li>
                <li>
                  Use the excerpt to summarize your post in 1-2 sentences.
                </li>
                <li>Add 2-5 relevant tags to help readers find your post.</li>
                <li>Check the preview to ensure formatting looks good.</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

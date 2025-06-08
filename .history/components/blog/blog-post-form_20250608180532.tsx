"use client";

import { useState, useRef } from "react";
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
  summary?: string;
  thumbnail?: string;
  tags?: string[];
}

export function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [summary, setSummary] = useState(post?.summary || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setThumbnail(data.secure_url);
      toast({
        title: "Image uploaded",
        description: "Thumbnail uploaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Upload error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          summary: summary.trim() || undefined,
          thumbnail: thumbnail || undefined,
          tags: tagArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
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
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
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
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="A short description of your post..."
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
                      <Label htmlFor="thumbnail">Thumbnail</Label>
                      <div className="flex gap-2">
                        <Input
                          id="thumbnail"
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          placeholder="Enter image URL or upload below..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
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
                      <Button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Publishing..." : "Publish Post"}
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
                          <div className="flex items-center gap-1">
                            <span>By {user?.fullName || "You"}</span>
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
                        {summary && (
                          <p className="text-muted-foreground italic">
                            {summary || "No summary provided"}
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
                </li>
                <li>
                  <strong>Summary</strong>: Add a short description to introduce
                  your post (optional).
                </li>
                <li>
                  <strong>Content</strong>: Write your story, using paragraphs
                  for readability.
                </li>
                <li>
                  <strong>Thumbnail</strong>: Paste an image URL or click
                  “Upload Image” to add a picture.
                </li>
                <li>
                  <strong>Tags</strong>: Enter comma-separated tags (e.g., tech,
                  coding).
                </li>
                <li>
                  <strong>Preview</strong>: Click “Preview” to see your post’s
                  appearance.
                </li>
                <li>
                  <strong>Publish</strong>: Click “Publish Post” to share
                  (requires sign-in).
                </li>
                <li>
                  <strong>Cancel</strong>: Click “Cancel” to discard changes.
                </li>
              </ul>
              <h3 className="font-semibold">Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep titles under 60 characters for SEO.</li>
                <li>Summarize your post in 1-2 sentences.</li>
                <li>Use high-quality images for thumbnails.</li>
                <li>Add 2-5 relevant tags.</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

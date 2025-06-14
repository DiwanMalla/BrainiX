// Blog Post Editor Page (Create/Edit)
"use client";

import { BlogPostForm } from "@/components/blog/blog-post-form";
import { useSearchParams } from "next/navigation";

export default function BlogPostEditorPage() {
  // Optionally, get postId from query for editing
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  // You can fetch the post by id and pass to BlogPostForm for editing
  // For now, just render the form for creating
  return <BlogPostForm />;
}

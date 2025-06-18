// Blog Post Editor Page (Create/Edit)
"use client";

import { Suspense } from "react";
import { BlogPostForm } from "@/components/blog/blog-post-form";
import { useSearchParams } from "next/navigation";

function BlogEditorContent() {
  // Optionally, get postId from query for editing
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  // TODO: Fetch the post by id and pass to BlogPostForm for editing
  // For now, just render the form for creating
  console.log("Editor loaded for post:", postId || "new post");
  return <BlogPostForm />;
}

export default function BlogPostEditorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10">Loading editor...</div>}>
      <BlogEditorContent />
    </Suspense>
  );
}

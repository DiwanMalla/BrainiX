import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/blog/blog-post-form";
import { getPostById } from "@/lib/blog/data";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostForm
      post={{
        ...post,
        excerpt: post.excerpt === null ? undefined : post.excerpt,
      }}
    />
  );
}

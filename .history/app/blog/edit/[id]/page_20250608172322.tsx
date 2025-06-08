import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/blog-post-form";
import { getPostById } from "@/lib/data";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return <BlogPostForm post={post} />;
}

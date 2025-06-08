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

  // Ensure 'content' property exists for BlogPostForm and convert null excerpt to undefined
  const postWithContent = {
    content: "",
    ...post,
    excerpt: post?.excerpt ?? undefined,
  };

  return <BlogPostForm post={postWithContent} />;
}

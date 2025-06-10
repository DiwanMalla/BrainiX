"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function deletePost(id: string) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Find the post and verify ownership
    const post = await prisma.blog.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete all related records first to maintain referential integrity
    await prisma.$transaction(async (tx) => {
      // Delete all comments likes
      await tx.blogCommentLike.deleteMany({
        where: {
          comment: {
            blogId: id,
          },
        },
      });

      // Delete all comments
      await tx.blogComment.deleteMany({
        where: {
          blogId: id,
        },
      });

      // Delete all post likes
      await tx.blogLike.deleteMany({
        where: {
          blogId: id,
        },
      });

      // Finally, delete the blog post
      await tx.blog.delete({
        where: {
          id,
        },
      });
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${id}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

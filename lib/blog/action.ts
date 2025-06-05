"use server";

import { revalidatePath } from "next/cache";
import { generateId, getPosts } from "./data";
import type { Post } from "./type";

// Mock current user (in a real app, this would come from authentication)
const currentUser = {
  id: "user-1",
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
};

// In-memory data store (referencing the same array from data.ts)
let posts: Post[] = [];

// Initialize posts from data.ts
async function initPosts() {
  if (posts.length === 0) {
    posts = await getPosts();
  }
}

export async function createPost(
  title: string,
  content: string
): Promise<string> {
  await initPosts();

  const newPost: Post = {
    id: generateId("post"),
    title,
    content,
    author: currentUser,
    createdAt: new Date(),
    category: "General",
    comments: [],
  };

  posts.unshift(newPost);
  revalidatePath("/");
  return newPost.id;
}

export async function updatePost(
  id: string,
  title: string,
  content: string
): Promise<void> {
  await initPosts();

  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex !== -1) {
    posts[postIndex] = {
      ...posts[postIndex],
      title,
      content,
    };
    revalidatePath(`/post/${id}`);
    revalidatePath("/");
  }
}

export async function deletePost(id: string): Promise<void> {
  await initPosts();

  posts = posts.filter((post) => post.id !== id);
  revalidatePath("/");
}

export async function addComment(
  postId: string,
  content: string
): Promise<void> {
  await initPosts();

  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex !== -1) {
    const newComment = {
      id: generateId("comment"),
      content,
      author: currentUser,
      createdAt: new Date(),
      replies: [],
    };

    posts[postIndex].comments.push(newComment);
    revalidatePath(`/post/${postId}`);
  }
}

export async function addReply(
  postId: string,
  commentId: string,
  content: string
): Promise<void> {
  await initPosts();

  const post = posts.find((post) => post.id === postId);
  if (!post) return;

  const comment = post.comments.find((comment) => comment.id === commentId);
  if (!comment) return;

  const newReply = {
    id: generateId("reply"),
    content,
    author: currentUser,
    createdAt: new Date(),
  };

  comment.replies.push(newReply);
  revalidatePath(`/post/${postId}`);
}

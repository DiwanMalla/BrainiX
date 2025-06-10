export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type User = {
  id: string;
  name: string;
  image?: string;
  avatar: string;
  // Add more fields if needed (e.g., email, role)
};

export type BlogLike = {
  id: string;
  blogId: string;
  userId: string;
  createdAt: string;
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies: Comment[];
  likes?: BlogLike[]; // if you're loading likes on comments too
  isAuthor?: boolean; // computed client-side
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  authorId: string;
  author: User;
  tags: string[];
  comments: Comment[];
  likes: BlogLike[];
  category: string;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
};

export interface User {
  id: string;
  name: string | null;
  image: string | null; // Changed from avatar/profileImageUrl to match API
}

export interface Comment {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  parentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: User;
  replies: Comment[]; // Recursive, as replies are comments
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
  };
  comments: Comment[]; // Full Comment objects, not just IDs
  likes: { id: string; userId: string }[];
  totalViews: number;
}

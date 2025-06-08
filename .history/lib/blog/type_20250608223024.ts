export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  parentId: string | null;
  replies: Reply[];
}

export interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  author: { name: string | null; image: string | null };
  comments: { id: string }[];
  likes: { id: string }[];
  totalViews: number;
  tags: string[];
}

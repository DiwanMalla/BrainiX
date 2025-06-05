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
  replies: Reply[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  category?: string;
  comments: Comment[];
}

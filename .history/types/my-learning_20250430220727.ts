interface Progress {
  id: string;
  completed: boolean;
  watchedSeconds?: number;
  lastPosition?: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
  progress: Progress[];
  // ... other fields
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  instructor: { name: string };
  modules: Module[];
  slug: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

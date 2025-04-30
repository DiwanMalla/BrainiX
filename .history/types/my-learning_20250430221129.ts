interface Progress {
  id?: string;
  completed?: boolean;
  watchedSeconds?: number;
  lastPosition?: number;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
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
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  thumbnail?: string | null;
  previewVideo?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"; // Adjust based on CourseLevel enum
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; // Adjust based on CourseStatus enum
  featured?: boolean;
  bestseller?: boolean;
  published?: boolean;
  publishedAt?: string | null;
  language?: string;
  subtitlesLanguages?: string[];
  certificateAvailable?: boolean;
  duration?: number;
  totalLessons?: number;
  totalModules?: number;
  requirements?: string[];
  learningObjectives?: string[];
  targetAudience?: string[];
  tags?: string[];
  rating?: number | null;
  totalStudents?: number | null;
  topCompanies?: string[];
  createdAt?: string;
  updatedAt?: string;
  instructor: { name: string; id: string }; // Include id for instructorId
  category?: { id: string; name: string }; // Optional if category is included
  modules: Module[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export {};
export type Module = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: "VIDEO" | "TEXT" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION";
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
  position: number;
};
export type Roles = "student" | "instructor" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  thumbnail?: string | null;
  previewVideo?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  bestseller: boolean;
  published: boolean;
  publishedAt?: Date | null;
  language: string;
  subtitlesLanguages: string[];
  duration: number|string;
  totalLessons: number;
  totalModules: number;
  requirements: string[];
  learningObjectives: string[];
  targetAudience: string[];
  tags: string[];
  rating?: number | null;
  totalStudents?: number | null;
  topCompanies: string[];
  createdAt: Date;
  updatedAt: Date;

  // Relations
  instructorId: string;
  categoryId: string;

  // Optional relations (when using includes)
  instructor?: User;
  category?: Category;
  modules?: Module[];
  reviews?: Review[];
  enrollments?: Enrollment[];
  // ... other relations as needed
  modules: Module[];
};

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED";

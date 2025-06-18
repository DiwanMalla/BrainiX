# Course Management System

The BrainiX platform provides a comprehensive course management system that enables instructors to create, organize, and deliver educational content while tracking student progress and engagement.

## Overview

The course management system includes:
- **Hierarchical Content Organization** (Courses → Modules → Lessons)
- **Multi-Media Content Support** (Video, Text, Quizzes, Resources)
- **Progress Tracking** with detailed analytics
- **Publishing Workflow** with draft and review states
- **SEO Optimization** with dynamic slug generation
- **Advanced Search and Filtering** capabilities

## Architecture

### Content Hierarchy

```
Course
├── Modules (Chapters/Sections)
│   ├── Lessons (Individual Learning Units)
│   │   ├── Video Content
│   │   ├── Text Content
│   │   ├── Quizzes
│   │   └── Resources (Downloads)
│   └── Module Resources
└── Course Resources
```

### Database Schema

```prisma
model Course {
  id                String      @id @default(cuid())
  title             String
  slug              String      @unique
  description       String?
  shortDescription  String?
  thumbnail         String?
  price             Decimal     @db.Decimal(10, 2)
  discountPrice     Decimal?    @db.Decimal(10, 2)
  level             Level       @default(BEGINNER)
  status            CourseStatus @default(DRAFT)
  published         Boolean     @default(false)
  featured          Boolean     @default(false)
  
  // Content organization
  modules           Module[]
  resources         Resource[]
  
  // Metadata
  tags              String[]
  duration          Int?        // Total duration in minutes
  totalStudents     Int         @default(0)
  averageRating     Float       @default(0)
  
  // Relationships
  instructor        User        @relation("InstructorCourses", fields: [instructorId], references: [id])
  instructorId      String
  category          Category    @relation(fields: [categoryId], references: [id])
  categoryId        String
  
  // Engagement
  enrollments       Enrollment[]
  reviews           Review[]
  cart              Cart[]
  wishlist          Wishlist[]
  orderItems        OrderItem[]
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum CourseStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}
```

## Course Creation Workflow

### 1. Course Initialization

```typescript
// Course Creation API (/app/api/instructor/courses/route.ts)
export async function POST(request: Request) {
  const { userId } = await auth();

  // Verify instructor role
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { instructorProfile: true },
  });

  if (user?.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const courseData = await request.json();
  
  // Generate unique slug
  const slug = await generateUniqueSlug(courseData.title);
  
  const course = await prisma.course.create({
    data: {
      ...courseData,
      instructorId: user.id,
      slug,
      status: "DRAFT",
      published: false,
    },
    include: {
      category: true,
      instructor: true,
    },
  });

  return NextResponse.json(course);
}
```

### 2. Content Management

```typescript
// Module Creation
export async function createModule(courseId: string, moduleData: any) {
  const module = await prisma.module.create({
    data: {
      ...moduleData,
      courseId,
      position: await getNextModulePosition(courseId),
    },
  });

  return module;
}

// Lesson Creation with Multiple Content Types
export async function createLesson(moduleId: string, lessonData: any) {
  const lesson = await prisma.lesson.create({
    data: {
      ...lessonData,
      moduleId,
      position: await getNextLessonPosition(moduleId),
      type: lessonData.videoUrl ? 'VIDEO' : 'TEXT',
    },
  });

  // Create associated resources if provided
  if (lessonData.resources) {
    await createLessonResources(lesson.id, lessonData.resources);
  }

  return lesson;
}
```

### 3. Publishing Pipeline

```typescript
// Course Publishing Workflow
export async function publishCourse(courseId: string) {
  // Validation checks
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  // Validate course completion
  const validationResult = validateCourseForPublishing(course);
  if (!validationResult.isValid) {
    return { success: false, errors: validationResult.errors };
  }

  // Update course status
  const publishedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: 'PUBLISHED',
      published: true,
      publishedAt: new Date(),
    },
  });

  // Generate SEO metadata
  await generateCourseMetadata(publishedCourse);

  return { success: true, course: publishedCourse };
}
```

## Content Types

### Video Lessons

```typescript
// Video Lesson Component
export function VideoLesson({ lesson, onProgress }: VideoLessonProps) {
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = useCallback(
    debounce((state: { playedSeconds: number; played: number }) => {
      setProgress(state.played * 100);
      
      // Save progress every 15 seconds
      if (state.playedSeconds % 15 === 0) {
        saveVideoProgress(lesson.id, state.playedSeconds);
      }
    }, 1000),
    [lesson.id]
  );

  const handleVideoEnd = () => {
    markLessonComplete(lesson.id);
    onProgress?.(100);
  };

  return (
    <div className="video-container">
      <ReactPlayer
        ref={playerRef}
        url={normalizeYouTubeUrl(lesson.videoUrl)}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        onEnded={handleVideoEnd}
        config={{
          youtube: {
            playerVars: {
              showinfo: 1,
              origin: window.location.origin,
            },
          },
        }}
      />
      
      <ProgressBar value={progress} className="mt-2" />
    </div>
  );
}
```

### Text Lessons

```typescript
// Rich Text Editor for Content Creation
export function TextLessonEditor({ 
  initialContent, 
  onSave 
}: TextLessonEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setWordCount(countWords(newContent));
  };

  const saveContent = async () => {
    await onSave({
      content,
      wordCount,
      estimatedReadTime: calculateReadTime(wordCount),
    });
  };

  return (
    <div className="text-editor">
      <RichTextEditor
        value={content}
        onChange={handleContentChange}
        features={['bold', 'italic', 'link', 'list', 'code']}
      />
      
      <div className="editor-stats">
        <span>Words: {wordCount}</span>
        <span>Est. Read Time: {calculateReadTime(wordCount)} min</span>
      </div>
      
      <Button onClick={saveContent}>Save Lesson</Button>
    </div>
  );
}
```

### Resource Management

```typescript
// File Upload and Resource Management
export function ResourceManager({ lessonId }: ResourceManagerProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        // Upload file to storage
        const uploadUrl = await uploadFile(file);
        
        // Create resource record
        const resource = await createResource({
          lessonId,
          title: file.name,
          url: uploadUrl,
          type: getFileType(file),
          size: file.size,
        });
        
        setResources(prev => [...prev, resource]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setUploading(false);
  };

  return (
    <div className="resource-manager">
      <FileDropzone
        onDrop={handleFileUpload}
        accept={{
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc', '.docx'],
          'text/plain': ['.txt'],
          'image/*': ['.png', '.jpg', '.jpeg'],
        }}
        disabled={uploading}
      />
      
      <ResourceList resources={resources} onDelete={handleDeleteResource} />
    </div>
  );
}
```

## Progress Tracking

### Learning Analytics

```typescript
// Progress Tracking System
export class ProgressTracker {
  static async trackLessonProgress(
    enrollmentId: string,
    lessonId: string,
    progressData: ProgressData
  ) {
    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      create: {
        enrollmentId,
        lessonId,
        watchedSeconds: progressData.watchedSeconds,
        completed: progressData.completed,
        completedAt: progressData.completed ? new Date() : null,
      },
      update: {
        watchedSeconds: Math.max(
          progressData.watchedSeconds,
          await getCurrentWatchedSeconds(enrollmentId, lessonId)
        ),
        completed: progressData.completed,
        completedAt: progressData.completed ? new Date() : null,
      },
    });

    // Update course completion percentage
    await this.updateCourseProgress(enrollmentId);
    
    return progress;
  }

  static async updateCourseProgress(enrollmentId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        progress: true,
      },
    });

    if (!enrollment) return;

    const totalLessons = enrollment.course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    const completedLessons = enrollment.progress.filter(
      (p) => p.completed
    ).length;

    const completionPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: completionPercentage,
        completedAt: completionPercentage === 100 ? new Date() : null,
      },
    });
  }
}
```

### Student Dashboard

```typescript
// Student Progress Dashboard
export function StudentProgress({ courseId }: StudentProgressProps) {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [courseId]);

  const fetchProgressData = async () => {
    const response = await fetch(`/api/courses/${courseId}/progress`);
    const data = await response.json();
    setProgressData(data);
    setLoading(false);
  };

  if (loading) return <ProgressSkeleton />;

  return (
    <div className="student-progress">
      <div className="progress-overview">
        <h3>Course Progress</h3>
        <CircularProgress
          value={progressData.completionPercentage}
          size="lg"
        />
        <p>{progressData.completedLessons} of {progressData.totalLessons} lessons completed</p>
      </div>

      <div className="module-progress">
        {progressData.modules.map((module) => (
          <ModuleProgressCard
            key={module.id}
            module={module}
            progress={module.progress}
          />
        ))}
      </div>

      <div className="learning-stats">
        <StatCard title="Time Spent" value={progressData.totalTimeSpent} />
        <StatCard title="Quiz Average" value={progressData.averageQuizScore} />
        <StatCard title="Notes Created" value={progressData.notesCount} />
      </div>
    </div>
  );
}
```

## Search and Discovery

### Advanced Search

```typescript
// Course Search API with Filtering
export async function searchCourses(searchParams: CourseSearchParams) {
  const {
    query,
    category,
    level,
    priceRange,
    rating,
    duration,
    sortBy = 'relevance',
    page = 1,
    limit = 12,
  } = searchParams;

  const where: Prisma.CourseWhereInput = {
    published: true,
    AND: [
      // Text search
      query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      } : {},
      
      // Category filter
      category ? { categoryId: category } : {},
      
      // Level filter
      level ? { level } : {},
      
      // Price range filter
      priceRange ? {
        price: {
          gte: priceRange.min,
          lte: priceRange.max,
        },
      } : {},
      
      // Rating filter
      rating ? { averageRating: { gte: rating } } : {},
      
      // Duration filter
      duration ? { duration: { lte: duration } } : {},
    ].filter(Boolean),
  };

  const orderBy = getSortOrder(sortBy);

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: true,
        category: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

### Recommendation Engine

```typescript
// Course Recommendation System
export class CourseRecommendations {
  static async getPersonalizedRecommendations(userId: string) {
    // Get user's learning history
    const userHistory = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
    });

    // Extract user preferences
    const preferences = this.extractUserPreferences(userHistory);
    
    // Find similar courses
    const recommendations = await prisma.course.findMany({
      where: {
        published: true,
        NOT: {
          id: {
            in: userHistory.map(h => h.course.id),
          },
        },
        OR: [
          // Same categories
          {
            categoryId: {
              in: preferences.preferredCategories,
            },
          },
          // Similar tags
          {
            tags: {
              hasSome: preferences.preferredTags,
            },
          },
          // Same level
          {
            level: preferences.preferredLevel,
          },
        ],
      },
      include: {
        instructor: true,
        category: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalStudents: 'desc' },
      ],
      take: 10,
    });

    return recommendations;
  }

  private static extractUserPreferences(history: any[]) {
    const categories = history.map(h => h.course.categoryId);
    const tags = history.flatMap(h => h.course.tags);
    const levels = history.map(h => h.course.level);

    return {
      preferredCategories: [...new Set(categories)],
      preferredTags: [...new Set(tags)],
      preferredLevel: this.getMostFrequent(levels),
    };
  }
}
```

## Performance Optimizations

### Caching Strategy

```typescript
// Redis Caching for Course Data
export class CourseCache {
  private static redis = new Redis(process.env.REDIS_URL);

  static async getCourse(slug: string) {
    const cacheKey = `course:${slug}`;
    
    // Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (course) {
      // Cache for 1 hour
      await this.redis.setex(cacheKey, 3600, JSON.stringify(course));
    }

    return course;
  }

  static async invalidateCache(slug: string) {
    await this.redis.del(`course:${slug}`);
  }
}
```

### Database Optimizations

```sql
-- Performance Indexes
CREATE INDEX idx_courses_published ON courses(published) WHERE published = true;
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_search ON courses USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_progress_enrollment_lesson ON progress(enrollment_id, lesson_id);
```

## Testing

### Unit Tests

```typescript
describe('Course Management', () => {
  test('should create course with valid data', async () => {
    const courseData = {
      title: 'Test Course',
      description: 'Test Description',
      price: 99.99,
      categoryId: 'category-1',
      level: 'BEGINNER',
    };

    const course = await createCourse(instructorId, courseData);
    
    expect(course).toBeDefined();
    expect(course.slug).toBe('test-course');
    expect(course.status).toBe('DRAFT');
  });

  test('should track lesson progress correctly', async () => {
    const progress = await trackLessonProgress(
      enrollmentId,
      lessonId,
      { watchedSeconds: 300, completed: true }
    );

    expect(progress.completed).toBe(true);
    expect(progress.watchedSeconds).toBe(300);
  });
});
```

The course management system provides a robust foundation for creating and delivering educational content while maintaining high performance and user experience standards.

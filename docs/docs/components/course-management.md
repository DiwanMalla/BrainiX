# Course Management System

The BrainiX platform provides a comprehensive course management system for creating, organizing, and delivering educational content with progress tracking.

## Core Features

### Content Hierarchy
```
Course → Modules → Lessons → Content (Video/Text/Quiz/Resources)
```

### Database Schema (Core Models)

```prisma
model Course {
  id          String  @id @default(cuid())
  title       String
  slug        String  @unique
  description String?
  thumbnail   String?
  price       Decimal @db.Decimal(10, 2)
  published   Boolean @default(false)
  
  instructorId String
  instructor   User   @relation(fields: [instructorId], references: [id])
  
  modules      Module[]
  enrollments  Enrollment[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Module {
  id       String @id @default(cuid())
  title    String
  order    Int
  courseId String
  course   Course @relation(fields: [courseId], references: [id])
  lessons  Lesson[]
}

model Lesson {
  id       String @id @default(cuid())
  title    String
  content  String?
  videoUrl String?
  order    Int
  moduleId String
  module   Module @relation(fields: [moduleId], references: [id])
}
```

## Course Management API

### Course Operations

```typescript
// Create Course
export async function POST(request: Request) {
  const data = await request.json();
  
  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      instructorId: data.instructorId,
      slug: generateSlug(data.title),
    },
  });
  
  return NextResponse.json(course);
}

// Get Course with Modules
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        include: { lessons: true },
        orderBy: { order: 'asc' }
      },
      instructor: true,
    },
  });
  
  return NextResponse.json(course);
}
```

### Module & Lesson Management

```typescript
// Add Module to Course
export async function createModule(courseId: string, moduleData: ModuleData) {
  return await prisma.module.create({
    data: {
      title: moduleData.title,
      order: moduleData.order,
      courseId,
    },
  });
}

// Add Lesson to Module
export async function createLesson(moduleId: string, lessonData: LessonData) {
  return await prisma.lesson.create({
    data: {
      title: lessonData.title,
      content: lessonData.content,
      videoUrl: lessonData.videoUrl,
      order: lessonData.order,
      moduleId,
    },
  });
}
```

## Progress Tracking

### Enrollment & Progress

```typescript
model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  status    EnrollmentStatus @default(ACTIVE)
  progress  Int      @default(0) // Percentage completion
  
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])
  
  enrolledAt DateTime @default(now())
}

// Track Lesson Completion
export async function markLessonComplete(userId: string, lessonId: string) {
  const progress = await prisma.lessonProgress.create({
    data: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });
  
  // Update overall course progress
  await updateCourseProgress(userId, progress.lesson.module.courseId);
  
  return progress;
}
```

## Key Features

- **Drag-and-drop content organization**
- **Rich text editor for lesson content**
- **Video upload and streaming**
- **Quiz integration with AI generation**
- **Progress analytics and reporting**
- **Course publishing workflow**
- **SEO-optimized course pages**

## Publishing Workflow

1. **Draft** → Create and edit content
2. **Review** → Internal quality check
3. **Published** → Live for student enrollment

---

*The course management system provides instructors with powerful tools to create engaging, structured learning experiences.*

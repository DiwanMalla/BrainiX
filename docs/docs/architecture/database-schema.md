---
sidebar_position: 3
title: Database Schema
description: Comprehensive database design and relationships for the BrainiX Learning Platform
---

# Database Schema & Data Architecture

The BrainiX platform uses a sophisticated PostgreSQL database with 24 primary models designed to support complex learning workflows, e-commerce operations, and real-time analytics. This document provides a complete overview of the database design, relationships, and optimization strategies.

## 🗄️ Schema Overview

```mermaid
erDiagram
    USER {
        string id PK
        string clerkId UK "Clerk authentication ID"
        string email UK
        string name
        enum role "STUDENT, INSTRUCTOR, ADMIN"
        string bio
        string website
        string avatar
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE {
        string id PK
        string title
        text description
        decimal price
        decimal discountPrice
        string thumbnail
        string instructorId FK
        string categoryId FK
        enum level "BEGINNER, INTERMEDIATE, ADVANCED"
        boolean published
        boolean featured
        integer totalStudents
        decimal averageRating
        json tags
        datetime createdAt
        datetime updatedAt
    }
    
    ENROLLMENT {
        string id PK
        string userId FK
        string courseId FK
        enum status "ACTIVE, COMPLETED, CANCELLED"
        decimal progress "0-100 percentage"
        datetime enrolledAt
        datetime completedAt
        datetime lastAccessedAt
    }
    
    PROGRESS {
        string id PK
        string enrollmentId FK
        string lessonId FK
        integer watchedSeconds
        boolean completed
        datetime completedAt
        datetime updatedAt
    }
    
    ORDER {
        string id PK
        string orderNumber UK
        string userId FK
        decimal subtotal
        decimal tax
        decimal discount
        decimal total
        enum status "PENDING, COMPLETED, FAILED, REFUNDED"
        string paymentId
        json metadata
        datetime createdAt
        datetime completedAt
    }
    
    USER ||--o{ COURSE : "instructs"
    USER ||--o{ ENROLLMENT : "enrolls in"
    USER ||--o{ ORDER : "places"
    COURSE ||--o{ ENROLLMENT : "has enrollments"
    ENROLLMENT ||--o{ PROGRESS : "tracks progress"
    ORDER ||--o{ ORDER_ITEM : "contains"
```

## 📊 Core Models

### User Management Models

#### User Model
The central entity for all platform users with role-based access control.

```prisma
model User {
  id       String   @id @default(cuid())
  clerkId  String   @unique // Clerk authentication integration
  email    String   @unique
  name     String
  role     UserRole @default(STUDENT)
  bio      String?  @db.Text
  website  String?
  avatar   String?
  
  // Profile extensions
  instructorProfile InstructorProfile?
  studentProfile    StudentProfile?
  
  // Relations
  courses     Course[]     @relation("InstructorCourses")
  enrollments Enrollment[]
  orders      Order[]
  cart        Cart[]
  wishlist    Wishlist[]
  reviews     Review[]
  notes       Note[]
  messages    Message[]
  blogPosts   Blog[]       @relation("BlogAuthor")
  blogComments BlogComment[]
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
  @@index([email])
  @@index([role])
  @@index([createdAt])
}

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}
```

#### Extended Profile Models

```prisma
model InstructorProfile {
  id       String @id @default(cuid())
  userId   String @unique
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Professional information
  title         String?
  expertise     String[] // Array of expertise areas
  experience    Int?     // Years of experience
  certifications String[] // Professional certifications
  
  // Analytics
  totalStudents  Int @default(0)
  totalRevenue   Decimal @default(0) @db.Decimal(10, 2)
  averageRating  Decimal @default(0) @db.Decimal(2, 1)
  totalCourses   Int @default(0)
  
  // Social links
  linkedIn String?
  twitter  String?
  github   String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("instructor_profiles")
}

model StudentProfile {
  id       String @id @default(cuid())
  userId   String @unique
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Learning preferences
  learningGoals    String[] // Array of learning objectives
  preferredTopics  String[] // Preferred subject areas
  skillLevel       String?  // Overall skill assessment
  timeAvailability String?  // Learning time availability
  
  // Progress tracking
  coursesCompleted Int @default(0)
  totalWatchTime   Int @default(0) // In seconds
  currentStreak    Int @default(0) // Learning streak in days
  longestStreak    Int @default(0)
  
  // Gamification
  totalPoints      Int @default(0)
  level           Int @default(1)
  badges          String[] // Earned achievement badges
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("student_profiles")
}
```

### Course Management Models

#### Course Model
The core model for course content and metadata.

```prisma
model Course {
  id          String      @id @default(cuid())
  title       String      @db.VarChar(200)
  slug        String      @unique
  description String      @db.Text
  shortDescription String? @db.VarChar(500)
  
  // Pricing
  price         Decimal  @db.Decimal(10, 2)
  discountPrice Decimal? @db.Decimal(10, 2)
  currency      String   @default("USD")
  
  // Media
  thumbnail     String?
  previewVideo  String?
  
  // Metadata
  level         CourseLevel @default(BEGINNER)
  duration      Int?        // Estimated duration in minutes
  language      String      @default("en")
  tags          String[]    // Searchable tags
  requirements  String[]    // Course prerequisites
  objectives    String[]    // Learning objectives
  
  // Relations
  instructor   User     @relation("InstructorCourses", fields: [instructorId], references: [id])
  instructorId String
  category     Category @relation(fields: [categoryId], references: [id])
  categoryId   String
  
  modules      Module[]
  enrollments  Enrollment[]
  reviews      Review[]
  cart         Cart[]
  wishlist     Wishlist[]
  orderItems   OrderItem[]
  
  // Status and analytics
  published      Boolean @default(false)
  featured       Boolean @default(false)
  totalStudents  Int     @default(0)
  averageRating  Decimal @default(0) @db.Decimal(2, 1)
  totalReviews   Int     @default(0)
  totalRevenue   Decimal @default(0) @db.Decimal(10, 2)
  
  // SEO
  metaTitle       String? @db.VarChar(60)
  metaDescription String? @db.VarChar(160)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("courses")
  @@index([published])
  @@index([featured])
  @@index([instructorId])
  @@index([categoryId])
  @@index([createdAt])
  @@fulltext([title, description])
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

#### Content Structure Models

```prisma
model Category {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  description String? @db.Text
  icon        String?
  color       String? // Hex color code
  
  // Hierarchy support
  parentId String?
  parent   Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  
  // Relations
  courses Course[]
  
  // Analytics
  totalCourses  Int @default(0)
  totalStudents Int @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("categories")
  @@index([slug])
  @@index([parentId])
}

model Module {
  id          String @id @default(cuid())
  title       String @db.VarChar(200)
  description String? @db.Text
  position    Int     // Order within course
  
  // Relations
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId String
  lessons  Lesson[]
  
  // Status
  published Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("modules")
  @@index([courseId])
  @@index([position])
}

model Lesson {
  id          String     @id @default(cuid())
  title       String     @db.VarChar(200)
  description String?    @db.Text
  content     String?    @db.Text // Rich text content
  position    Int        // Order within module
  type        LessonType @default(VIDEO)
  
  // Media content
  videoUrl    String?    // YouTube or video URL
  videoDuration Int?     // Duration in seconds
  
  // Relations
  module   Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  moduleId String
  
  resources Resource[]
  quizzes   Quiz[]
  progress  Progress[]
  notes     Note[]
  
  // Status
  published Boolean @default(false)
  isFree    Boolean @default(false) // Free preview lesson
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("lessons")
  @@index([moduleId])
  @@index([position])
}

enum LessonType {
  VIDEO
  TEXT
  QUIZ
  ASSIGNMENT
  LIVE_SESSION
}

model Resource {
  id       String @id @default(cuid())
  title    String @db.VarChar(200)
  type     ResourceType
  url      String     // File URL or external link
  fileSize Int?       // File size in bytes
  
  // Relations
  lesson   Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  lessonId String
  
  createdAt DateTime @default(now())
  
  @@map("resources")
  @@index([lessonId])
}

enum ResourceType {
  PDF
  DOCUMENT
  SPREADSHEET
  PRESENTATION
  CODE
  LINK
}
```

### Learning & Assessment Models

```prisma
model Enrollment {
  id       String           @id @default(cuid())
  userId   String
  courseId String
  status   EnrollmentStatus @default(ACTIVE)
  
  // Progress tracking
  progress        Decimal  @default(0) @db.Decimal(5, 2) // 0-100 percentage
  lastLessonId    String?  // Last accessed lesson
  totalWatchTime  Int      @default(0) // Total watch time in seconds
  
  // Relations
  user     User       @relation(fields: [userId], references: [id])
  course   Course     @relation(fields: [courseId], references: [id])
  progress Progress[]
  notes    Note[]
  
  // Timestamps
  enrolledAt      DateTime  @default(now())
  completedAt     DateTime?
  lastAccessedAt  DateTime  @default(now())
  
  @@map("enrollments")
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@index([status])
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  SUSPENDED
}

model Progress {
  id           String @id @default(cuid())
  enrollmentId String
  lessonId     String
  
  // Progress data
  watchedSeconds Int     @default(0)
  completed      Boolean @default(false)
  
  // Relations
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lesson     Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  // Timestamps
  startedAt   DateTime? // When user first accessed lesson
  completedAt DateTime? // When lesson was completed
  updatedAt   DateTime  @updatedAt
  
  @@map("progress")
  @@unique([enrollmentId, lessonId])
  @@index([enrollmentId])
  @@index([lessonId])
}

model Quiz {
  id          String     @id @default(cuid())
  title       String     @db.VarChar(200)
  description String?    @db.Text
  type        QuizType   @default(PRACTICE)
  timeLimit   Int?       // Time limit in minutes
  passingScore Int       @default(70) // Percentage required to pass
  
  // Relations
  lesson    Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  lessonId  String
  questions Question[]
  attempts  QuizAttempt[]
  
  // Settings
  shuffleQuestions Boolean @default(false)
  showCorrectAnswers Boolean @default(true)
  allowRetakes     Boolean @default(true)
  maxAttempts      Int?    // Null means unlimited
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("quizzes")
  @@index([lessonId])
}

enum QuizType {
  PRACTICE
  GRADED
  FINAL_EXAM
}

model Question {
  id       String       @id @default(cuid())
  quizId   String
  text     String       @db.Text
  type     QuestionType @default(MULTIPLE_CHOICE)
  points   Int          @default(1)
  
  // Question data
  options       String[] // For multiple choice questions
  correctAnswer String   // Correct answer(s)
  explanation   String?  @db.Text
  
  // Relations
  quiz    Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  answers Answer[]
  
  createdAt DateTime @default(now())
  
  @@map("questions")
  @@index([quizId])
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  ESSAY
  FILL_IN_BLANK
}

model QuizAttempt {
  id       String @id @default(cuid())
  userId   String
  quizId   String
  
  // Attempt data
  score           Decimal   @db.Decimal(5, 2) // Percentage score
  totalQuestions  Int
  correctAnswers  Int
  timeSpent       Int       // Time spent in seconds
  passed          Boolean   @default(false)
  
  // Relations
  user    User     @relation(fields: [userId], references: [id])
  quiz    Quiz     @relation(fields: [quizId], references: [id])
  answers Answer[]
  
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  
  @@map("quiz_attempts")
  @@index([userId])
  @@index([quizId])
}

model Answer {
  id            String @id @default(cuid())
  attemptId     String
  questionId    String
  selectedAnswer String // User's answer
  isCorrect     Boolean
  pointsEarned  Int    @default(0)
  
  // Relations
  attempt  QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question Question   @relation(fields: [questionId], references: [id])
  
  @@map("answers")
  @@unique([attemptId, questionId])
}
```

### E-commerce Models

```prisma
model Cart {
  id       String @id @default(cuid())
  userId   String
  courseId String
  
  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  addedAt DateTime @default(now())
  
  @@map("cart")
  @@unique([userId, courseId])
  @@index([userId])
}

model Wishlist {
  id       String @id @default(cuid())
  userId   String
  courseId String
  
  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  addedAt DateTime @default(now())
  
  @@map("wishlist")
  @@unique([userId, courseId])
  @@index([userId])
}

model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique
  userId      String
  
  // Financial data
  subtotal    Decimal @db.Decimal(10, 2)
  tax         Decimal @default(0) @db.Decimal(10, 2)
  discount    Decimal @default(0) @db.Decimal(10, 2)
  total       Decimal @db.Decimal(10, 2)
  currency    String  @default("USD")
  
  // Payment information
  paymentId     String?     // Stripe payment intent ID
  paymentMethod String?     // Payment method used
  status        OrderStatus @default(PENDING)
  
  // Relations
  user     User        @relation(fields: [userId], references: [id])
  items    OrderItem[]
  coupon   Coupon?     @relation(fields: [couponId], references: [id])
  couponId String?
  
  // Metadata
  metadata Json? // Additional order data
  
  // Timestamps
  createdAt   DateTime  @default(now())
  completedAt DateTime?
  
  @@map("orders")
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

model OrderItem {
  id       String @id @default(cuid())
  orderId  String
  courseId String
  
  // Item data
  title    String  // Course title at time of purchase
  price    Decimal @db.Decimal(10, 2)
  discount Decimal @default(0) @db.Decimal(10, 2)
  
  // Relations
  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id])
  
  @@map("order_items")
  @@index([orderId])
}

model Coupon {
  id          String     @id @default(cuid())
  code        String     @unique
  type        CouponType
  value       Decimal    @db.Decimal(10, 2) // Amount or percentage
  description String?    @db.Text
  
  // Usage constraints
  maxUses       Int?      // Maximum number of uses
  usedCount     Int       @default(0)
  minOrderValue Decimal?  @db.Decimal(10, 2) // Minimum order amount
  
  // Validity
  validFrom DateTime
  validUntil DateTime?
  active    Boolean  @default(true)
  
  // Relations
  orders Order[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("coupons")
  @@index([code])
  @@index([validFrom, validUntil])
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}
```

## 🔍 Database Optimization

### Indexing Strategy

```sql
-- Performance indexes for frequent queries
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY idx_courses_published ON courses(published) WHERE published = true;
CREATE INDEX CONCURRENTLY idx_courses_featured ON courses(featured) WHERE featured = true;
CREATE INDEX CONCURRENTLY idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX CONCURRENTLY idx_progress_enrollment ON progress(enrollment_id);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_courses_search ON courses USING gin(to_tsvector('english', title || ' ' || description));

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY idx_courses_instructor_published ON courses(instructor_id, published);
CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders(user_id, status);
```

### Query Optimization Examples

```typescript
// Optimized course listing with strategic includes
export const getCoursesWithDetails = async (filters: CourseFilters) => {
  return await prisma.course.findMany({
    where: {
      published: true,
      ...filters
    },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      price: true,
      discountPrice: true,
      averageRating: true,
      totalStudents: true,
      level: true,
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    },
    orderBy: [
      { featured: 'desc' },
      { totalStudents: 'desc' },
      { createdAt: 'desc' }
    ],
    take: filters.limit,
    skip: filters.offset
  });
};

// Optimized user dashboard query
export const getUserDashboardData = async (userId: string) => {
  const [enrollments, orders, progress] = await prisma.$transaction([
    // Active enrollments with course details
    prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: { select: { name: true } }
          }
        }
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 10
    }),
    
    // Recent orders
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            course: { select: { title: true, thumbnail: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    
    // Overall progress statistics
    prisma.progress.groupBy({
      by: ['completed'],
      where: {
        enrollment: { userId }
      },
      _count: true
    })
  ]);
  
  return { enrollments, orders, progress };
};
```

### Connection Pool Configuration

```typescript
// Prisma client configuration for production
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  errorFormat: 'pretty'
});

// Connection pool settings (via DATABASE_URL)
const databaseUrl = `postgresql://user:password@host:5432/database?
  connection_limit=20&
  pool_timeout=20&
  sslmode=require`;
```

## 📊 Data Analytics Schema

```prisma
model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String?  // Null for anonymous events
  sessionId String   // Session identifier
  event     String   // Event name
  properties Json    // Event properties
  
  // Context
  userAgent String?
  ipAddress String?
  referrer  String?
  
  createdAt DateTime @default(now())
  
  @@map("analytics_events")
  @@index([userId])
  @@index([event])
  @@index([createdAt])
}

model CourseAnalytics {
  id       String @id @default(cuid())
  courseId String
  date     DateTime @db.Date
  
  // Metrics
  views           Int @default(0)
  enrollments     Int @default(0)
  completions     Int @default(0)
  totalWatchTime  Int @default(0) // In seconds
  averageRating   Decimal @default(0) @db.Decimal(2, 1)
  revenue         Decimal @default(0) @db.Decimal(10, 2)
  
  // Relations
  course Course @relation(fields: [courseId], references: [id])
  
  @@map("course_analytics")
  @@unique([courseId, date])
  @@index([date])
}
```

---

This database schema provides a robust foundation for the BrainiX learning platform, supporting complex educational workflows, e-commerce operations, and comprehensive analytics while maintaining data integrity and performance at scale.

:::tip Schema Evolution
The database schema is designed to evolve with the platform's needs. All migrations are versioned and can be safely applied to production using Prisma's migration system.
:::

# Learning System

The BrainiX learning system provides an interactive educational experience with progress tracking, AI-powered assessments, and personalized learning paths.

## Core Features

### Learning Flow

```
Enrollment → Course Access → Lesson Consumption → Progress Tracking → Assessment → Completion
```

### System Components

- **Interactive Video Learning** with progress tracking
- **AI-Generated Quizzes** using Groq Cloud API
- **Real-time Progress Analytics**
- **Note-taking System** with lesson synchronization
- **Completion Certificates** and achievements

## Video Learning Platform

### Video Player with Progress Tracking

```typescript
export function VideoPlayer({
  lesson,
  enrollment,
  onProgress,
}: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [watched, setWatched] = useState(false);

  const handleProgress = async (time: number) => {
    setCurrentTime(time);

    // Track progress every 30 seconds
    if (time % 30 === 0) {
      await updateLessonProgress(lesson.id, enrollment.id, time);
    }

    // Mark as complete when 90% watched
    if (time / lesson.duration > 0.9 && !watched) {
      setWatched(true);
      await markLessonComplete(lesson.id, enrollment.id);
      onProgress?.();
    }
  };

  return (
    <video
      src={lesson.videoUrl}
      onTimeUpdate={(e) => handleProgress(e.currentTarget.currentTime)}
      controls
      width="100%"
    />
  );
}
```

## Progress Tracking System

### Progress Database Schema

```typescript
interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseProgress {
  enrollmentId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessedAt: Date;
}
```

### Progress Calculation

```typescript
// Calculate course completion percentage
export async function calculateCourseProgress(
  enrollmentId: string
): Promise<number> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
      progress: true,
    },
  });

  const totalLessons = enrollment.course.modules.flatMap(
    (module) => module.lessons
  ).length;

  const completedLessons = enrollment.progress.filter(
    (p) => p.completed
  ).length;

  return Math.round((completedLessons / totalLessons) * 100);
}
```

## AI-Powered Quiz System

### Quiz Generation Integration

```typescript
// Generate quiz for completed lesson
export async function generateLessonQuiz(lessonId: string): Promise<Quiz> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  // Use Groq AI to generate questions
  const quizData = await GroqQuizService.generateQuiz(lesson);

  const quiz = await prisma.quiz.create({
    data: {
      lessonId,
      title: `${lesson.title} - Assessment`,
      questions: {
        create: quizData.questions.map((q) => ({
          question: q.text,
          options: q.options,
          correctAnswer: q.correctIndex,
          explanation: q.explanation,
        })),
      },
    },
  });

  return quiz;
}
```

### Quiz Taking & Scoring

```typescript
// Submit quiz answers
export async function submitQuiz(
  quizId: string,
  answers: QuizAnswers
): Promise<QuizResult> {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  let correctAnswers = 0;
  const results = quiz.questions.map((question, index) => {
    const isCorrect = question.correctAnswer === answers[index];
    if (isCorrect) correctAnswers++;

    return {
      questionId: question.id,
      userAnswer: answers[index],
      isCorrect,
      explanation: question.explanation,
    };
  });

  const score = Math.round((correctAnswers / quiz.questions.length) * 100);

  // Save quiz attempt
  await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: answers.userId,
      score,
      answers: JSON.stringify(answers),
      completedAt: new Date(),
    },
  });

  return { score, results, passed: score >= 70 };
}
```

## Note-Taking System

### Lesson Notes

```typescript
interface LessonNote {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  timestamp?: number; // Video timestamp
  createdAt: Date;
}

// Create note with video timestamp
export async function createLessonNote(
  userId: string,
  lessonId: string,
  content: string,
  timestamp?: number
): Promise<LessonNote> {
  return await prisma.note.create({
    data: {
      userId,
      lessonId,
      content,
      timestamp,
    },
  });
}
```

## Adaptive Learning

### Personalized Recommendations

```typescript
// Recommend next lessons based on progress
export async function getPersonalizedRecommendations(
  userId: string
): Promise<Lesson[]> {
  const userProgress = await analyzeUserProgress(userId);
  const weakAreas = identifyWeakAreas(userProgress);

  return await findRelevantLessons(weakAreas);
}

// Adaptive difficulty adjustment
export async function adjustQuizDifficulty(
  userId: string,
  lessonId: string
): Promise<string> {
  const previousScores = await getUserQuizHistory(userId);
  const averageScore = calculateAverageScore(previousScores);

  if (averageScore > 85) return "ADVANCED";
  if (averageScore > 70) return "INTERMEDIATE";
  return "BEGINNER";
}
```

## Completion & Certification

### Course Completion

```typescript
// Check and award course completion
export async function checkCourseCompletion(
  enrollmentId: string
): Promise<boolean> {
  const progress = await calculateCourseProgress(enrollmentId);

  if (progress >= 100) {
    await awardCertificate(enrollmentId);
    return true;
  }

  return false;
}

// Generate completion certificate
export async function awardCertificate(
  enrollmentId: string
): Promise<Certificate> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true, course: true },
  });

  return await prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      certificateId: generateCertificateId(),
      issuedAt: new Date(),
    },
  });
}
```

## Analytics & Insights

### Learning Analytics

```typescript
// Student progress dashboard
export async function getStudentAnalytics(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
      progress: true,
      quizAttempts: true,
    },
  });

  return {
    totalCourses: enrollments.length,
    completedCourses: enrollments.filter((e) => e.progressPercentage === 100)
      .length,
    averageScore: calculateAverageQuizScore(enrollments),
    totalStudyTime: calculateTotalStudyTime(enrollments),
    certificates: await getCertificateCount(userId),
  };
}
```

---

_The learning system creates an engaging, adaptive educational experience that tracks progress and optimizes learning outcomes through AI-powered insights._

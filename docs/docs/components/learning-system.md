---
sidebar_position: 5
title: Learning System
description: Interactive learning experience with progress tracking and AI assessments
---

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

### Progress Tracking API

```typescript
// Track lesson progress
export async function updateLessonProgress(
  lessonId: string,
  enrollmentId: string,
  currentTime: number
) {
  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId, lessonId },
    },
    update: { currentTime },
    create: {
      enrollmentId,
      lessonId,
      currentTime,
      isCompleted: false,
    },
  });
}
```

## AI-Powered Quiz Generation

### Groq Integration

```typescript
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateQuiz(content: string, difficulty: string) {
  const prompt = `
    Create a quiz based on this content: ${content}
    Difficulty: ${difficulty}
    Format: JSON with questions, options, and correct answers
  `;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

### Quiz Component

```typescript
export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete({ score, total: questions.length });
    }
  };

  return (
    <div className="quiz-container">
      <h3>{questions[currentQuestion].question}</h3>
      {questions[currentQuestion].options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswer(option)}
          className="answer-option"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

## Progress Analytics

### Student Dashboard

```typescript
export function ProgressDashboard({ userId }: { userId: string }) {
  const { data: progress } = useQuery({
    queryKey: ["progress", userId],
    queryFn: () => getStudentProgress(userId),
  });

  return (
    <div className="progress-dashboard">
      <div className="stats-grid">
        <StatCard title="Courses Enrolled" value={progress?.totalCourses} />
        <StatCard
          title="Completed Lessons"
          value={progress?.completedLessons}
        />
        <StatCard title="Quiz Average" value={`${progress?.averageScore}%`} />
        <StatCard title="Study Time" value={`${progress?.totalStudyTime}h`} />
      </div>

      <ProgressChart data={progress?.weeklyProgress} />
    </div>
  );
}
```

### Progress Calculation

```typescript
export async function calculateProgress(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: { include: { lessons: true } },
      lessonCompletions: true,
      quizResults: true,
    },
  });

  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonCompletions.length;
  const progress = (completedLessons / totalLessons) * 100;

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { progress },
  });

  return progress;
}
```

## Note-Taking System

### Smart Notes

```typescript
export function NotesPanel({ lessonId, timestamp }: NotesProps) {
  const [notes, setNotes] = useState("");

  const saveNote = async () => {
    await prisma.note.create({
      data: {
        content: notes,
        lessonId,
        timestamp, // Video timestamp for context
        userId: currentUser.id,
      },
    });
  };

  return (
    <div className="notes-panel">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Take notes at this timestamp..."
        className="notes-textarea"
      />
      <button onClick={saveNote}>Save Note</button>
    </div>
  );
}
```

## Certificate Generation

### Completion Certificate

```typescript
export async function generateCertificate(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: true,
      course: { include: { instructor: true } },
    },
  });

  const certificateData = {
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    instructorName: enrollment.course.instructor.name,
    completionDate: new Date(),
    certificateId: `CERT-${Date.now()}`,
  };

  // Generate PDF certificate
  const certificate = await generatePDF(certificateData);

  // Save to database
  await prisma.certificate.create({
    data: {
      enrollmentId,
      certificateId: certificateData.certificateId,
      issuedAt: new Date(),
    },
  });

  return certificate;
}
```

## Real-time Features

### Live Progress Updates

```typescript
// WebSocket connection for real-time updates
export function useRealtimeProgress(enrollmentId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`/api/ws/progress/${enrollmentId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
    };

    return () => ws.close();
  }, [enrollmentId]);

  return progress;
}
```

This learning system creates an engaging and comprehensive educational experience with AI-powered features and real-time feedback.

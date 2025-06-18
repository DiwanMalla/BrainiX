# Learning System

The BrainiX learning system provides an immersive and interactive educational experience with comprehensive progress tracking, AI-powered assessments, and personalized learning paths.

## Overview

The learning system encompasses:
- **Interactive Video Learning** with progress tracking
- **AI-Generated Quizzes** using Groq Cloud API
- **Real-time Progress Analytics** for students and instructors
- **Note-taking System** with lesson synchronization
- **Adaptive Learning Paths** based on performance
- **Completion Certificates** and achievements

## Architecture

### Learning Flow

```
Enrollment → Course Access → Module Navigation → Lesson Consumption → Progress Tracking → Assessment → Completion
```

### Core Components

```typescript
// Learning System Architecture
interface LearningSystem {
  enrollment: EnrollmentManager;
  progress: ProgressTracker;
  content: ContentDelivery;
  assessment: QuizSystem;
  notes: NoteManager;
  certificates: CertificateGenerator;
}
```

## Video Learning Platform

### Video Player Implementation

```typescript
// Advanced Video Player with Progress Tracking
export function VideoPlayer({ 
  lesson, 
  enrollment, 
  onProgress, 
  onComplete 
}: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef<ReactPlayer>(null);

  // Debounced progress saving to avoid excessive API calls
  const debouncedSaveProgress = useCallback(
    debounce(async (watchedSeconds: number) => {
      await saveVideoProgress(enrollment.id, lesson.id, watchedSeconds);
    }, 5000), // Save every 5 seconds
    [enrollment.id, lesson.id]
  );

  const handleProgress = useCallback((state: {
    playedSeconds: number;
    played: number;
    loadedSeconds: number;
    loaded: number;
  }) => {
    setCurrentTime(state.playedSeconds);
    debouncedSaveProgress(state.playedSeconds);
    
    // Call parent progress handler
    onProgress?.(state.played * 100);
  }, [debouncedSaveProgress, onProgress]);

  const handleVideoEnd = async () => {
    // Mark lesson as complete
    await markLessonComplete(enrollment.id, lesson.id);
    
    // Trigger completion callback
    onComplete?.(lesson.id);
    
    // Auto-advance to next lesson if available
    const nextLesson = await getNextLesson(lesson.id);
    if (nextLesson) {
      // Navigate to next lesson
      router.push(`/courses/${enrollment.course.slug}/lessons/${nextLesson.slug}`);
    }
  };

  const seekToPosition = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={normalizeYouTubeUrl(lesson.videoUrl)}
          width="100%"
          height="100%"
          controls
          playing={false}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={handleVideoEnd}
          onReady={() => {
            // Resume from last position
            if (lesson.lastWatchedSeconds > 0) {
              seekToPosition(lesson.lastWatchedSeconds);
            }
          }}
          config={{
            youtube: {
              playerVars: {
                showinfo: 1,
                origin: window.location.origin,
                modestbranding: 1,
              },
            },
          }}
        />
      </div>

      {/* Custom Controls */}
      <VideoControls
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        onSeek={seekToPosition}
        onPlaybackRateChange={setPlaybackRate}
      />

      {/* Progress Indicator */}
      <ProgressBar
        value={(currentTime / duration) * 100}
        className="video-progress"
      />
    </div>
  );
}
```

### Video Progress API

```typescript
// Video Progress Tracking API (/app/api/courses/progress/route.ts)
export async function POST(req: Request) {
  const { userId } = await auth();
  const { lessonId, watchedSeconds, completed } = await req.json();

  // Get user enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userData.id,
      course: {
        modules: {
          some: {
            lessons: {
              some: { id: lessonId }
            }
          }
        }
      }
    }
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  // Upsert progress record
  const progress = await prisma.progress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    },
    create: {
      enrollmentId: enrollment.id,
      lessonId,
      watchedSeconds,
      completed: completed || false,
      completedAt: completed ? new Date() : null,
    },
    update: {
      watchedSeconds: Math.max(watchedSeconds, await getCurrentWatchedSeconds(enrollment.id, lessonId)),
      completed: completed || undefined,
      completedAt: completed ? new Date() : undefined,
    },
  });

  // Update overall course progress
  await updateCourseProgress(enrollment.id);

  return NextResponse.json({ success: true, progress });
}

async function updateCourseProgress(enrollmentId: string) {
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

  const completedLessons = enrollment.progress.filter(p => p.completed).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: progressPercentage,
      completedAt: progressPercentage === 100 ? new Date() : null,
    },
  });
}
```

## AI-Powered Quiz System

### Quiz Generation with Groq AI

```typescript
// AI Quiz Generation Service
export class AIQuizGenerator {
  private static readonly GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  
  static async generateQuiz(lesson: Lesson): Promise<Quiz> {
    try {
      const prompt = this.buildQuizPrompt(lesson);
      
      const response = await axios.post(
        this.GROQ_API_URL,
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are an expert educational content creator. Generate high-quality quiz questions based on lesson content. 
                       Return EXACTLY 5 multiple-choice questions with 4 options each.
                       Format your response as valid JSON with the following structure:
                       {
                         "questions": [
                           {
                             "question": "Question text",
                             "options": ["Option A", "Option B", "Option C", "Option D"],
                             "correctAnswer": 0,
                             "explanation": "Detailed explanation of the correct answer"
                           }
                         ]
                       }`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const quizData = JSON.parse(aiResponse);
      
      // Create quiz in database
      const quiz = await this.createQuizFromAI(lesson.id, quizData);
      
      return quiz;
    } catch (error) {
      console.error("AI Quiz Generation Error:", error);
      throw new Error("Failed to generate quiz");
    }
  }

  private static buildQuizPrompt(lesson: Lesson): string {
    return `
      Generate educational quiz questions for the following lesson:
      
      Title: ${lesson.title}
      Description: ${lesson.description || 'No description provided'}
      Content Type: ${lesson.type}
      Duration: ${lesson.duration ? `${lesson.duration} minutes` : 'Not specified'}
      
      ${lesson.content ? `Content: ${lesson.content}` : ''}
      
      Requirements:
      - Create exactly 5 multiple-choice questions
      - Each question should have 4 options
      - Questions should test understanding, not just memorization
      - Include practical application questions when relevant
      - Provide clear explanations for correct answers
      - Vary difficulty levels (2 easy, 2 medium, 1 challenging)
    `;
  }

  private static async createQuizFromAI(lessonId: string, quizData: any): Promise<Quiz> {
    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title: `Quiz: ${await getLessonTitle(lessonId)}`,
        description: "AI-generated quiz to test your understanding",
        timeLimit: 300, // 5 minutes default
        questions: {
          create: quizData.questions.map((q: any, index: number) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: 1,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return quiz;
  }
}
```

### Quiz Taking Interface

```typescript
// Interactive Quiz Component
export function QuizInterface({ quiz, onComplete }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeRemaining]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      const submission = {
        quizId: quiz.id,
        answers: Object.entries(answers).map(([questionIndex, selectedOption]) => ({
          questionId: quiz.questions[parseInt(questionIndex)].id,
          selectedOption,
        })),
        timeSpent: quiz.timeLimit - timeRemaining,
      };

      const result = await submitQuiz(submission);
      onComplete(result);
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allAnswered = quiz.questions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="quiz-interface">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <ProgressBar value={((currentQuestion + 1) / quiz.questions.length) * 100} />
        </div>
        
        <div className="quiz-timer">
          <Timer timeRemaining={timeRemaining} />
        </div>
      </div>

      {/* Question */}
      <div className="question-container">
        <h3 className="question-text">{currentQ.question}</h3>
        
        <div className="options-grid">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                answers[currentQuestion] === index ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="question-indicators">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              className={`question-indicator ${
                answers[index] !== undefined ? 'answered' : ''
              } ${currentQuestion === index ? 'current' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered || isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={answers[currentQuestion] === undefined}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Quiz Results and Analytics

```typescript
// Quiz Results Component
export function QuizResults({ result }: QuizResultsProps) {
  const { score, totalQuestions, correctAnswers, timeSpent, answers } = result;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  return (
    <div className="quiz-results">
      <div className="results-header">
        <div className="score-circle">
          <CircularProgress value={percentage} size="xl">
            <span className="score-text">{percentage}%</span>
          </CircularProgress>
        </div>
        
        <div className="results-summary">
          <h2>Quiz Complete!</h2>
          <p>You answered {correctAnswers} out of {totalQuestions} questions correctly</p>
          <p>Time spent: {formatTime(timeSpent)}</p>
          
          <div className="performance-badge">
            <Badge variant={getPerformanceBadge(percentage).variant}>
              {getPerformanceBadge(percentage).text}
            </Badge>
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="answers-review">
        <h3>Answer Review</h3>
        
        {answers.map((answer, index) => (
          <QuestionReview
            key={index}
            question={answer.question}
            userAnswer={answer.selectedOption}
            correctAnswer={answer.correctAnswer}
            explanation={answer.explanation}
            isCorrect={answer.isCorrect}
          />
        ))}
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Recommended Next Steps</h3>
        {percentage < 70 ? (
          <RecommendationCard
            type="review"
            title="Review the lesson content"
            description="Consider reviewing the lesson material before proceeding"
            action="Review Lesson"
          />
        ) : (
          <RecommendationCard
            type="continue"
            title="Great job! Continue learning"
            description="You're ready to move on to the next lesson"
            action="Next Lesson"
          />
        )}
      </div>
    </div>
  );
}
```

## Note-Taking System

### Synchronized Notes

```typescript
// Note-taking Component with Auto-save
export function LessonNotes({ lessonId, enrollmentId }: LessonNotesProps) {
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save notes every 30 seconds
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      if (content.trim() === '') return;
      
      setIsSaving(true);
      try {
        await saveNote(enrollmentId, lessonId, content);
        setLastSaved(new Date());
      } catch (error) {
        toast.error('Failed to save notes');
      } finally {
        setIsSaving(false);
      }
    }, 30000),
    [enrollmentId, lessonId]
  );

  useEffect(() => {
    debouncedSave(notes);
  }, [notes, debouncedSave]);

  // Load existing notes
  useEffect(() => {
    loadExistingNotes();
  }, [lessonId]);

  const loadExistingNotes = async () => {
    try {
      const existingNotes = await fetchNotes(enrollmentId, lessonId);
      if (existingNotes) {
        setNotes(existingNotes.content);
        setLastSaved(new Date(existingNotes.updatedAt));
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const insertTimestamp = () => {
    const timestamp = new Date().toLocaleString();
    const insertion = `\n\n--- ${timestamp} ---\n`;
    setNotes(prev => prev + insertion);
  };

  return (
    <div className="lesson-notes">
      <div className="notes-header">
        <h3>Your Notes</h3>
        <div className="notes-actions">
          <Button variant="outline" size="sm" onClick={insertTimestamp}>
            Add Timestamp
          </Button>
          <span className="save-status">
            {isSaving ? (
              <span className="saving">Saving...</span>
            ) : lastSaved ? (
              <span className="saved">Saved {formatRelativeTime(lastSaved)}</span>
            ) : null}
          </span>
        </div>
      </div>

      <MarkdownEditor
        value={notes}
        onChange={handleNotesChange}
        placeholder="Take notes as you learn... Your notes are automatically saved."
        height={400}
        features={['bold', 'italic', 'link', 'list', 'heading']}
      />

      <div className="notes-tips">
        <p>💡 Tip: Use markdown formatting to organize your notes</p>
      </div>
    </div>
  );
}
```

### Notes API

```typescript
// Notes Management API (/app/api/notes/route.ts)
export async function POST(req: Request) {
  const { userId } = await auth();
  const { enrollmentId, lessonId, content } = await req.json();

  // Verify user owns the enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      userId: userData.id,
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const note = await prisma.note.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    create: {
      enrollmentId,
      lessonId,
      content,
    },
    update: {
      content,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(note);
}

export async function GET(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const enrollmentId = searchParams.get('enrollmentId');
  const lessonId = searchParams.get('lessonId');

  if (!enrollmentId) {
    return NextResponse.json({ error: "Missing enrollmentId" }, { status: 400 });
  }

  const where: any = {
    enrollment: {
      userId: userData.id,
      id: enrollmentId,
    },
  };

  if (lessonId) {
    where.lessonId = lessonId;
  }

  const notes = await prisma.note.findMany({
    where,
    include: {
      lesson: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return NextResponse.json(notes);
}
```

## Learning Analytics

### Progress Dashboard

```typescript
// Comprehensive Learning Analytics
export function LearningAnalytics({ enrollmentId }: LearningAnalyticsProps) {
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    fetchAnalytics();
  }, [enrollmentId, timeRange]);

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/analytics/learning/${enrollmentId}?range=${timeRange}`);
    const data = await response.json();
    setAnalytics(data);
  };

  if (!analytics) return <AnalyticsSkeleton />;

  return (
    <div className="learning-analytics">
      <div className="analytics-header">
        <h2>Learning Progress</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Overview Cards */}
      <div className="analytics-overview">
        <MetricCard
          title="Course Progress"
          value={`${analytics.courseProgress}%`}
          change={analytics.progressChange}
          icon={BookOpen}
        />
        <MetricCard
          title="Time Spent"
          value={formatDuration(analytics.totalTimeSpent)}
          change={analytics.timeChange}
          icon={Clock}
        />
        <MetricCard
          title="Quiz Average"
          value={`${analytics.averageQuizScore}%`}
          change={analytics.quizScoreChange}
          icon={Trophy}
        />
        <MetricCard
          title="Streak"
          value={`${analytics.currentStreak} days`}
          change={analytics.streakChange}
          icon={Flame}
        />
      </div>

      {/* Progress Chart */}
      <Card className="progress-chart">
        <CardHeader>
          <CardTitle>Daily Learning Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <LearningProgressChart data={analytics.dailyProgress} />
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card className="module-progress">
        <CardHeader>
          <CardTitle>Module Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="modules-grid">
            {analytics.moduleProgress.map((module) => (
              <ModuleProgressCard
                key={module.id}
                module={module}
                progress={module.completionPercentage}
                timeSpent={module.timeSpent}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card className="learning-insights">
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <LearningInsights data={analytics.insights} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Adaptive Learning

### Personalized Learning Paths

```typescript
// Adaptive Learning Algorithm
export class AdaptiveLearning {
  static async generateLearningPath(
    userId: string,
    courseId: string
  ): Promise<LearningPath> {
    // Get user's learning profile
    const profile = await this.getUserLearningProfile(userId);
    
    // Analyze course content
    const courseAnalysis = await this.analyzeCourseContent(courseId);
    
    // Get user's performance data
    const performance = await this.getUserPerformance(userId, courseId);
    
    // Generate personalized path
    const learningPath = await this.createAdaptivePath({
      profile,
      courseAnalysis,
      performance,
    });
    
    return learningPath;
  }

  private static async getUserLearningProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        enrollments: {
          include: {
            progress: true,
            quizAttempts: true,
          },
        },
      },
    });

    return {
      learningStyle: this.inferLearningStyle(profile),
      preferredPace: this.inferLearningPace(profile),
      strongAreas: this.identifyStrongAreas(profile),
      improvementAreas: this.identifyImprovementAreas(profile),
    };
  }

  private static createAdaptivePath(data: {
    profile: LearningProfile;
    courseAnalysis: CourseAnalysis;
    performance: PerformanceData;
  }) {
    const { profile, courseAnalysis, performance } = data;
    
    return {
      recommendedOrder: this.optimizeLessonOrder(courseAnalysis, profile),
      focusAreas: this.identifyFocusAreas(performance),
      estimatedDuration: this.calculatePersonalizedDuration(profile, courseAnalysis),
      adaptiveQuizzes: this.configureAdaptiveQuizzes(performance),
      supplementaryResources: this.recommendSupplementaryContent(profile),
    };
  }
}
```

The learning system provides a comprehensive and engaging educational experience that adapts to individual learning styles and provides detailed analytics to track progress and optimize outcomes.

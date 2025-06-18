# AI Features

The BrainiX platform leverages cutting-edge AI technologies to enhance the learning experience through intelligent quiz generation, personalized course recommendations, and interactive chat assistance.

## Overview

The AI system provides:
- **Intelligent Quiz Generation** using Groq Cloud API with Llama 3.1 70B
- **Course Recommendation Engine** powered by Google Gemini
- **Interactive Chat Assistant** for learning support
- **Content Analysis** for improved course discovery
- **Adaptive Learning Paths** based on student performance
- **Automated Content Categorization** and tagging

## Architecture

### AI Service Integration

```typescript
interface AISystem {
  quizGenerator: GroqQuizService;
  chatAssistant: GeminiChatService;
  recommendations: RecommendationEngine;
  contentAnalyzer: ContentAnalysisService;
  adaptiveLearning: AdaptiveLearningAI;
}
```

### AI Pipeline

```
Content Input → AI Processing → Intelligence Layer → User Interface → Feedback Loop
```

## Groq-Powered Quiz Generation

### Quiz Generation Service

```typescript
// AI Quiz Generation Service using Groq Cloud API
export class GroqQuizService {
  private static readonly API_URL = "https://api.groq.com/openai/v1/chat/completions";
  private static readonly MODEL = "llama3-70b-8192";

  static async generateQuiz(lesson: Lesson): Promise<GeneratedQuiz> {
    try {
      const prompt = this.buildQuizPrompt(lesson);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 3000,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse and validate AI response
      const quizData = this.parseAIResponse(aiResponse);
      
      // Create quiz in database
      const quiz = await this.createQuizFromAI(lesson.id, quizData);
      
      return quiz;
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  private static getSystemPrompt(): string {
    return `You are an expert educational content creator and assessment designer. Your task is to generate high-quality, pedagogically sound quiz questions based on lesson content.

REQUIREMENTS:
- Generate exactly 5 multiple-choice questions
- Each question must have exactly 4 options (A, B, C, D)
- Questions should test understanding, application, and analysis - not just memorization
- Include a mix of difficulty levels: 2 easy, 2 medium, 1 challenging
- Provide detailed explanations for correct answers
- Ensure questions are relevant to the lesson content
- Use clear, unambiguous language
- Avoid trick questions or overly complex scenarios

OUTPUT FORMAT:
Return valid JSON with this exact structure:
{
  "questions": [
    {
      "question": "Clear, concise question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct",
      "difficulty": "easy|medium|hard",
      "bloomsLevel": "remember|understand|apply|analyze|evaluate|create"
    }
  ]
}`;
  }

  private static buildQuizPrompt(lesson: Lesson): string {
    return `
Generate a comprehensive quiz for the following lesson:

LESSON DETAILS:
Title: ${lesson.title}
Description: ${lesson.description || 'No description provided'}
Type: ${lesson.type}
Duration: ${lesson.duration ? `${lesson.duration} minutes` : 'Not specified'}

CONTENT:
${lesson.content || 'Video-based lesson - generate questions based on typical content for this topic'}

ADDITIONAL CONTEXT:
${lesson.resources?.length ? `Resources available: ${lesson.resources.map(r => r.title).join(', ')}` : ''}

Focus the questions on:
1. Key concepts and definitions
2. Practical applications
3. Problem-solving scenarios
4. Critical thinking elements
5. Real-world examples

Ensure questions are appropriate for the lesson's educational level and learning objectives.
`;
  }

  private static parseAIResponse(response: string): QuizData {
    try {
      // Clean up the response - remove any markdown formatting
      const cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanResponse);
      
      // Validate structure
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response structure: missing questions array');
      }

      if (parsed.questions.length !== 5) {
        throw new Error(`Expected 5 questions, got ${parsed.questions.length}`);
      }

      // Validate each question
      parsed.questions.forEach((q: any, index: number) => {
        this.validateQuestion(q, index);
      });

      return parsed;
    } catch (error) {
      console.error('AI response parsing error:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private static validateQuestion(question: any, index: number): void {
    const requiredFields = ['question', 'options', 'correctAnswer', 'explanation'];
    
    for (const field of requiredFields) {
      if (!question[field]) {
        throw new Error(`Question ${index + 1}: Missing required field '${field}'`);
      }
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
    }

    if (typeof question.correctAnswer !== 'number' || 
        question.correctAnswer < 0 || 
        question.correctAnswer > 3) {
      throw new Error(`Question ${index + 1}: correctAnswer must be 0, 1, 2, or 3`);
    }
  }

  private static async createQuizFromAI(
    lessonId: string, 
    quizData: QuizData
  ): Promise<Quiz> {
    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title: `AI-Generated Quiz`,
        description: 'Automatically generated quiz to test your understanding of this lesson',
        timeLimit: 300, // 5 minutes
        passingScore: 60,
        questions: {
          create: quizData.questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: 1,
            order: index + 1,
            difficulty: q.difficulty || 'medium',
            bloomsLevel: q.bloomsLevel || 'understand',
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return quiz;
  }
}
```

### Quiz Generation API

```typescript
// AI Quiz Generation API (/app/api/quiz/generate/route.ts)
export async function POST(req: Request) {
  const { userId } = await auth();
  const { lessonId } = await req.json();

  try {
    // Verify user access to the lesson
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          course: {
            OR: [
              { instructorId: userData.id }, // Instructor owns course
              {
                enrollments: {
                  some: { userId: userData.id }, // User is enrolled
                },
              },
            ],
          },
        },
      },
      include: {
        resources: true,
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found or access denied' },
        { status: 404 }
      );
    }

    // Check if quiz already exists
    const existingQuiz = await prisma.quiz.findFirst({
      where: { lessonId },
    });

    if (existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz already exists for this lesson' },
        { status: 400 }
      );
    }

    // Generate quiz using AI
    const quiz = await GroqQuizService.generateQuiz(lesson);

    // Log generation for analytics
    await logQuizGeneration(lessonId, userData.id, quiz.id);

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        questionCount: quiz.questions.length,
        timeLimit: quiz.timeLimit,
      },
    });

  } catch (error) {
    console.error('Quiz generation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

async function logQuizGeneration(
  lessonId: string,
  userId: string,
  quizId: string
) {
  await prisma.quizGenerationLog.create({
    data: {
      lessonId,
      userId,
      quizId,
      generatedAt: new Date(),
      aiModel: 'llama3-70b-8192',
      success: true,
    },
  });
}
```

## Gemini-Powered Chat Assistant

### Chat Service Implementation

```typescript
// Google Gemini Chat Service
export class GeminiChatService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  static async generateResponse(
    message: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    try {
      const prompt = this.buildChatPrompt(message, context);
      
      const response = await fetch(
        `${this.API_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Parse response for course recommendations
      const recommendations = this.extractCourseRecommendations(
        aiResponse,
        context.availableCourses
      );

      return {
        message: aiResponse,
        recommendations,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  private static buildChatPrompt(message: string, context: ChatContext): string {
    return `You are BrainiX Assistant, an intelligent learning companion for an online education platform. Your role is to help students find relevant courses, answer learning-related questions, and provide educational guidance.

CONTEXT:
- User: ${context.user?.firstName || 'Student'}
- Current Course: ${context.currentCourse?.title || 'None'}
- User's Learning Level: ${context.userLevel || 'Beginner'}
- Enrolled Courses: ${context.enrolledCourses?.length || 0}

AVAILABLE COURSES:
${context.availableCourses?.map(course => 
  `- ${course.title} (${course.level}) - ${course.category.name} - $${course.price}`
).join('\n') || 'No courses available'}

USER QUESTION:
${message}

INSTRUCTIONS:
1. Provide helpful, educational responses
2. Recommend relevant courses when appropriate
3. Be encouraging and supportive
4. Use a friendly, professional tone
5. If recommending courses, explain why they're relevant
6. Keep responses concise but informative
7. Focus on learning outcomes and benefits

RESPONSE FORMAT:
Provide your response in a conversational manner. If recommending courses, mention them naturally in your response.`;
  }

  private static extractCourseRecommendations(
    response: string,
    availableCourses: Course[]
  ): Course[] {
    // Simple keyword matching for course recommendations
    const mentionedCourses: Course[] = [];
    
    availableCourses.forEach(course => {
      const titleWords = course.title.toLowerCase().split(' ');
      const responseText = response.toLowerCase();
      
      // Check if course title or keywords are mentioned
      if (titleWords.some(word => responseText.includes(word)) ||
          course.tags.some(tag => responseText.includes(tag.toLowerCase()))) {
        mentionedCourses.push(course);
      }
    });

    return mentionedCourses.slice(0, 3); // Limit to 3 recommendations
  }
}
```

### Chat Interface Component

```typescript
// AI Chat Interface
export function AIChatAssistant({ courseId }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);

  useEffect(() => {
    initializeChat();
  }, [courseId]);

  const initializeChat = async () => {
    // Load chat context
    const chatContext = await loadChatContext(courseId);
    setContext(chatContext);
    
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your BrainiX learning assistant. I can help you find courses, answer questions about your learning journey, and provide educational guidance. What would you like to know?`,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          courseId,
          context,
        }),
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recommendations: data.suggestedCourses,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-assistant">
      <div className="chat-header">
        <div className="assistant-avatar">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3>BrainiX Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Your AI learning companion
          </p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onCourseRecommendation={handleCourseRecommendation}
          />
        ))}
        
        {isLoading && (
          <div className="loading-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about courses, learning paths, or any educational topic..."
          rows={2}
          className="flex-1 resize-none"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Chat API

```typescript
// AI Chat API (/app/api/chat/route.ts)
export async function POST(req: Request) {
  const { userId } = await auth();
  const { message, courseId, context } = await req.json();

  try {
    // Get user context
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                category: true,
              },
            },
          },
        },
        studentProfile: true,
      },
    });

    // Get available courses for recommendations
    const availableCourses = await prisma.course.findMany({
      where: {
        published: true,
        NOT: {
          enrollments: {
            some: { userId: user.id },
          },
        },
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        category: true,
      },
      take: 20,
    });

    const chatContext: ChatContext = {
      user,
      currentCourse: courseId ? await getCourse(courseId) : null,
      enrolledCourses: user.enrollments,
      availableCourses,
      userLevel: user.studentProfile?.level || 'BEGINNER',
    };

    // Generate AI response
    const response = await GeminiChatService.generateResponse(
      message,
      chatContext
    );

    // Log chat interaction for analytics
    await logChatInteraction(user.id, message, response.message);

    return NextResponse.json({
      response: response.message,
      suggestedCourses: response.recommendations,
      timestamp: response.timestamp,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

async function logChatInteraction(
  userId: string,
  userMessage: string,
  aiResponse: string
) {
  await prisma.chatLog.create({
    data: {
      userId,
      userMessage,
      aiResponse,
      timestamp: new Date(),
      aiModel: 'gemini-pro',
    },
  });
}
```

## Recommendation Engine

### Personalized Course Recommendations

```typescript
// Advanced Recommendation Engine
export class RecommendationEngine {
  static async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<CourseRecommendation[]> {
    // Get user's learning profile
    const userProfile = await this.getUserProfile(userId);
    
    // Get user's learning history
    const learningHistory = await this.getLearningHistory(userId);
    
    // Get similar users
    const similarUsers = await this.findSimilarUsers(userId);
    
    // Generate recommendations using multiple strategies
    const recommendations = await Promise.all([
      this.getContentBasedRecommendations(userProfile, learningHistory),
      this.getCollaborativeRecommendations(similarUsers),
      this.getPopularityBasedRecommendations(userProfile),
      this.getCategoryBasedRecommendations(userProfile),
    ]);

    // Merge and score recommendations
    const mergedRecommendations = this.mergeRecommendations(recommendations);
    
    // Apply business rules and filters
    const filteredRecommendations = this.applyFilters(
      mergedRecommendations,
      userProfile
    );

    return filteredRecommendations.slice(0, limit);
  }

  private static async getContentBasedRecommendations(
    userProfile: UserProfile,
    learningHistory: LearningHistory
  ): Promise<CourseRecommendation[]> {
    // Extract user preferences from completed courses
    const preferredCategories = learningHistory.completedCourses
      .map(course => course.categoryId);
    
    const preferredTags = learningHistory.completedCourses
      .flatMap(course => course.tags);

    const preferredInstructors = learningHistory.completedCourses
      .map(course => course.instructorId);

    // Find similar courses
    const similarCourses = await prisma.course.findMany({
      where: {
        published: true,
        NOT: {
          id: {
            in: learningHistory.enrolledCourseIds,
          },
        },
        OR: [
          {
            categoryId: {
              in: preferredCategories,
            },
          },
          {
            tags: {
              hasSome: preferredTags,
            },
          },
          {
            instructorId: {
              in: preferredInstructors,
            },
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
    });

    return similarCourses.map(course => ({
      course,
      score: this.calculateContentSimilarityScore(course, learningHistory),
      reason: 'Based on your completed courses',
      strategy: 'content-based',
    }));
  }

  private static async getCollaborativeRecommendations(
    similarUsers: SimilarUser[]
  ): Promise<CourseRecommendation[]> {
    const recommendedCourseIds = similarUsers
      .flatMap(user => user.enrolledCourses)
      .map(course => course.id);

    const courseCounts = this.countOccurrences(recommendedCourseIds);
    
    const popularCourses = await prisma.course.findMany({
      where: {
        id: { in: Object.keys(courseCounts) },
        published: true,
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
    });

    return popularCourses.map(course => ({
      course,
      score: courseCounts[course.id] / similarUsers.length,
      reason: 'Students like you also enrolled in this course',
      strategy: 'collaborative',
    }));
  }

  private static calculateContentSimilarityScore(
    course: Course,
    history: LearningHistory
  ): number {
    let score = 0;

    // Category match (high weight)
    if (history.preferredCategories.includes(course.categoryId)) {
      score += 0.4;
    }

    // Tag overlap (medium weight)
    const tagOverlap = course.tags.filter(tag => 
      history.preferredTags.includes(tag)
    ).length;
    score += (tagOverlap / Math.max(course.tags.length, 1)) * 0.3;

    // Instructor match (medium weight)
    if (history.preferredInstructors.includes(course.instructorId)) {
      score += 0.2;
    }

    // Popularity boost (low weight)
    score += Math.min(course._count.enrollments / 1000, 0.1);

    return score;
  }
}
```

### Recommendation API

```typescript
// Course Recommendations API (/app/api/recommendations/route.ts)
export async function GET(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const strategy = searchParams.get('strategy') || 'all';

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let recommendations: CourseRecommendation[];

    switch (strategy) {
      case 'ai':
        recommendations = await AIRecommendationService.getAIRecommendations(
          user.id,
          limit
        );
        break;
      case 'content':
        recommendations = await RecommendationEngine.getContentBasedRecommendations(
          user.id,
          limit
        );
        break;
      default:
        recommendations = await RecommendationEngine.getPersonalizedRecommendations(
          user.id,
          limit
        );
    }

    return NextResponse.json({
      recommendations: recommendations.map(rec => ({
        course: rec.course,
        score: rec.score,
        reason: rec.reason,
      })),
    });

  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
```

## AI Analytics and Monitoring

### AI Usage Analytics

```typescript
// AI Analytics Service
export class AIAnalyticsService {
  static async trackQuizGeneration(
    lessonId: string,
    userId: string,
    success: boolean,
    errorMessage?: string
  ) {
    await prisma.aiUsageLog.create({
      data: {
        service: 'QUIZ_GENERATION',
        userId,
        lessonId,
        success,
        errorMessage,
        timestamp: new Date(),
        model: 'llama3-70b-8192',
      },
    });
  }

  static async trackChatInteraction(
    userId: string,
    messageLength: number,
    responseLength: number,
    success: boolean
  ) {
    await prisma.aiUsageLog.create({
      data: {
        service: 'CHAT_ASSISTANT',
        userId,
        success,
        metadata: {
          messageLength,
          responseLength,
        },
        timestamp: new Date(),
        model: 'gemini-pro',
      },
    });
  }

  static async getAIUsageStats(dateRange: DateRange) {
    const stats = await prisma.aiUsageLog.groupBy({
      by: ['service', 'success'],
      where: {
        timestamp: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      _count: {
        id: true,
      },
    });

    return this.formatUsageStats(stats);
  }
}
```

## Performance Optimization

### AI Response Caching

```typescript
// AI Response Caching
export class AICacheService {
  private static redis = new Redis(process.env.REDIS_URL);

  static async getCachedQuiz(lessonId: string): Promise<Quiz | null> {
    const cacheKey = `quiz:${lessonId}`;
    const cached = await this.redis.get(cacheKey);
    
    return cached ? JSON.parse(cached) : null;
  }

  static async cacheQuiz(lessonId: string, quiz: Quiz): Promise<void> {
    const cacheKey = `quiz:${lessonId}`;
    await this.redis.setex(cacheKey, 86400, JSON.stringify(quiz)); // 24 hours
  }

  static async getCachedRecommendations(
    userId: string
  ): Promise<CourseRecommendation[] | null> {
    const cacheKey = `recommendations:${userId}`;
    const cached = await this.redis.get(cacheKey);
    
    return cached ? JSON.parse(cached) : null;
  }

  static async cacheRecommendations(
    userId: string,
    recommendations: CourseRecommendation[]
  ): Promise<void> {
    const cacheKey = `recommendations:${userId}`;
    await this.redis.setex(cacheKey, 3600, JSON.stringify(recommendations)); // 1 hour
  }
}
```

## Error Handling and Fallbacks

### AI Service Resilience

```typescript
// AI Service with Fallbacks
export class ResilientAIService {
  static async generateQuizWithFallback(lesson: Lesson): Promise<Quiz> {
    try {
      // Try primary AI service (Groq)
      return await GroqQuizService.generateQuiz(lesson);
    } catch (error) {
      console.error('Primary quiz generation failed:', error);
      
      try {
        // Fallback to secondary service or template-based generation
        return await this.generateTemplateQuiz(lesson);
      } catch (fallbackError) {
        console.error('Fallback quiz generation failed:', fallbackError);
        throw new Error('Quiz generation temporarily unavailable');
      }
    }
  }

  private static async generateTemplateQuiz(lesson: Lesson): Promise<Quiz> {
    // Generate basic quiz using predefined templates
    const templates = await this.getQuizTemplates(lesson.type);
    const selectedTemplate = this.selectBestTemplate(templates, lesson);
    
    return await this.createQuizFromTemplate(lesson.id, selectedTemplate);
  }
}
```

The AI features system provides intelligent automation and personalization throughout the BrainiX platform, enhancing the learning experience while maintaining reliability and performance.

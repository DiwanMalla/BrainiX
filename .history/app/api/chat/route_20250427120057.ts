import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";
import Redis from "ioredis";

interface ChatRequestBody {
  message: string;
  courseId?: string;
}

interface CourseCard {
  title: string;
  price: number;
  duration: number;
  rating: number | null;
  category: string;
  slug: string;
  instructor: string;
  enrollmentCount: number;
  thumbnail?: string;
}

interface ChatResponse {
  reply: string;
  courses: CourseCard[];
  intent: string;
  confidence: number;
}

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(req: NextRequest) {
  try {
    const { message, courseId } = (await req.json()) as ChatRequestBody;

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid or missing message" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Validate user authentication
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Intent detection
    const intent = detectIntent(message);
    const confidence = calculateIntentConfidence(message, intent);

    // Base context about BrainiX
    let context = `
      You are BrainiX AI, an advanced assistant for the BrainiX e-learning platform, specializing in technology, business, design, and more.
      Your role is to provide concise, accurate, and engaging answers tailored to the user's intent.
      BrainiX courses include details like title, price (in USD), duration (in hours), rating (out of 5), category, instructor, enrollment count, and slug.
      When users ask about courses, return relevant course details in a structured format.
      If a course ID is provided, include specific course details.
      For general course queries, suggest up to 3 relevant courses based on the user's intent (e.g., category, price, skill level, or specific topics like "Python").
      Encourage users to enroll via the platform's course pages (/courses/[slug]).
      Handle ambiguous queries by asking clarifying questions or suggesting popular courses.
      Personalize responses based on detected intent (e.g., "cheap" for low price, "beginner" for entry-level, specific topics like "Python", "Marketing").
      
      Example queries and responses:
      - Query: "I want to learn Python"
        Response: "Great choice! Python is a versatile programming language. Here are some recommended Python courses: [Course details provided separately]."
      - Query: "Cheap courses under $20"
        Response: "Looking for affordable learning options? Here are some courses under $20: [Course details provided separately]."
      - Query: "What is BrainiX?"
        Response: "BrainiX is an AI-powered e-learning platform offering courses in technology, business, design, and more. Explore our courses to start learning today!"
    `;

    // Fetch course context if provided
    if (courseId) {
      try {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: {
            title: true,
            price: true,
            duration: true,
            rating: true,
            category: true,
            slug: true,
            instructor: true,
            enrollmentCount: true,
            thumbnail: true,
          },
        });
        if (course) {
          context += `
            Specific course details:
            - Title: ${course.title}
            - Price: $${course.price.toFixed(2)}
            - Duration: ${course.duration} hours
            - Rating: ${course.rating?.toFixed(1) || "N/A"}/5
            - Category: ${course.category}
            - Instructor: ${course.instructor}
            - Enrollments: ${course.enrollmentCount}
            - Enroll: /courses/${course.slug}
          `;
        } else {
          context += " Course context: No course found for the provided ID.";
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        context += " Course context: Unable to fetch course details.";
      }
    }

    // Handle course-related queries
    let courseCards: CourseCard[] = [];
    let courseResponse = "";
    if (intent.includes("course")) {
      try {
        // Check Redis cache
        const cacheKey = `courses:${intent}:${message.toLowerCase()}:${
          courseId || ""
        }`;
        const cachedCourses = await redis.get(cacheKey);
        if (cachedCourses) {
          courseCards = JSON.parse(cachedCourses);
          courseResponse =
            "Here are some recommended courses:\n" +
            courseCards.map((c) => `- **${c.title}**`).join("\n");
        } else {
          // Parse query for filters
          const filters = parseQueryFilters(message);

          // Fetch courses from Prisma
          const courses = await prisma.course.findMany({
            where: {
              ...(filters.category
                ? { category: { is: { name: filters.category } } }
                : {}),
              ...(filters.maxPrice ? { price: { lte: filters.maxPrice } } : {}),
              ...(filters.skillLevel ? { level: filters.skillLevel } : {}),
              ...(filters.topic
                ? { title: { contains: filters.topic, mode: "insensitive" } }
                : {}),
              ...(filters.minRating
                ? { rating: { gte: filters.minRating } }
                : {}),
            },
            select: {
              title: true,
              price: true,
              duration: true,
              rating: true,
              category: true,
              slug: true,
              instructor: true,
              enrollmentCount: true,
              thumbnail: true,
            },
            take: 3,
            orderBy: intent.includes("popular")
              ? { enrollmentCount: "desc" }
              : { rating: "desc" },
          });

          if (courses.length > 0) {
            courseResponse = "Here are some recommended courses:\n";
            courseCards = courses.map((course) => {
              courseResponse += `
                - **${course.title}**
                  - Price: $${course.price.toFixed(2)}
                  - Duration: ${course.duration} hours
                  - Rating: ${course.rating?.toFixed(1) || "N/A"}/5
                  - Category: ${course.category}
                  - Instructor: ${course.instructor}
                  - Enrollments: ${course.enrollmentCount}
                  - Enroll: /courses/${course.slug}
              `;
              return {
                title: course.title,
                price: course.price,
                duration: course.duration,
                rating: course.rating,
                category: course.category,
                slug: course.slug,
                instructor: course.instructor,
                enrollmentCount: course.enrollmentCount,
                thumbnail: course.thumbnail,
              };
            });

            // Cache results for 1 hour
            await redis.set(cacheKey, JSON.stringify(courseCards), "EX", 3600);
          } else {
            courseResponse =
              "No courses found matching your criteria. Try asking for a specific category, topic, or price range!";
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        courseResponse = "Unable to fetch course details at this time.";
      }
    }

    // Construct prompt for Gemini
    const prompt = `
      ${context}
      ${courseResponse ? `\nCourse details:\n${courseResponse}` : ""}
      User Intent: ${intent} (Confidence: ${confidence.toFixed(2)})
      User: ${message}
      Provide a concise, helpful, and engaging response. If courses are relevant, mention that course recommendations are provided separately.
      For ambiguous queries, suggest popular courses or ask clarifying questions.
      Ensure responses are personalized and encourage users to explore BrainiX features or enroll in courses.
    `;

    // Call Google Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY },
        timeout: 10000, // 10-second timeout
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      throw new Error("No response from Gemini API");
    }

    return NextResponse.json(
      { reply, courses: courseCards, intent, confidence },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in chat API:", error.message, error.response?.data);
    if (error.response?.status === 403 || error.message.includes("403")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key or insufficient permissions" },
        { status: 403 }
      );
    } else if (
      error.response?.status === 429 ||
      error.message.includes("429")
    ) {
      return NextResponse.json(
        { error: "Gemini API rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else if (
      error.response?.status === 400 ||
      error.message.includes("400")
    ) {
      return NextResponse.json(
        { error: "Invalid request to Gemini API. Please check your input." },
        { status: 400 }
      );
    } else if (error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Request to Gemini API timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Intent detection logic
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.match(/course|class|learn|study|training/)) {
    if (lowerMessage.includes("python")) return "course_python";
    if (lowerMessage.includes("marketing")) return "course_marketing";
    if (lowerMessage.includes("javascript")) return "course_javascript";
    if (lowerMessage.includes("data science")) return "course_data_science";
    if (lowerMessage.includes("cheap") || lowerMessage.includes("affordable"))
      return "course_cheap";
    if (lowerMessage.includes("beginner") || lowerMessage.includes("newbie"))
      return "course_beginner";
    if (lowerMessage.includes("advanced") || lowerMessage.includes("expert"))
      return "course_advanced";
    if (lowerMessage.includes("popular") || lowerMessage.includes("trending"))
      return "course_popular";
    return "course_general";
  }
  if (lowerMessage.includes("brainix") || lowerMessage.includes("platform"))
    return "platform_info";
  return "general";
}

// Confidence calculation (simplified)
function calculateIntentConfidence(message: string, intent: string): number {
  const keywords = {
    course_python: ["python", "coding", "programming"],
    course_marketing: ["marketing", "digital marketing", "advertising"],
    course_javascript: ["javascript", "js", "web development"],
    course_data_science: ["data science", "machine learning", "analytics"],
    course_cheap: ["cheap", "affordable", "under", "budget"],
    course_beginner: ["beginner", "newbie", "starter"],
    course_advanced: ["advanced", "expert", "professional"],
    course_popular: ["popular", "trending", "best"],
    course_general: ["course", "class", "learn", "study"],
    platform_info: ["brainix", "platform", "about"],
  };

  const lowerMessage = message.toLowerCase();
  const matchedKeywords = keywords[intent as keyof typeof keywords] || [];
  const matches = matchedKeywords.filter((keyword) =>
    lowerMessage.includes(keyword)
  ).length;
  return Math.min(0.9, matches / Math.max(1, matchedKeywords.length)) + 0.1; // Base confidence of 0.1
}

// Parse query filters
function parseQueryFilters(message: string): {
  category?: string;
  maxPrice?: number;
  skillLevel?: string;
  topic?: string;
  minRating?: number;
} {
  const lowerMessage = message.toLowerCase();
  let category: string | undefined;
  let maxPrice: number | undefined;
  let skillLevel: string | undefined;
  let topic: string | undefined;
  let minRating: number | undefined;

  // Category detection
  if (lowerMessage.includes("technology") || lowerMessage.includes("tech")) {
    category = "Technology";
  } else if (lowerMessage.includes("business")) {
    category = "Business";
  } else if (lowerMessage.includes("design")) {
    category = "Design";
  }

  // Price detection
  if (lowerMessage.match(/under \$?(\d+)/i)) {
    maxPrice = parseInt(lowerMessage.match(/under \$?(\d+)/i)![1]);
  } else if (
    lowerMessage.includes("cheap") ||
    lowerMessage.includes("affordable")
  ) {
    maxPrice = 50;
  }

  // Skill level detection
  if (lowerMessage.includes("beginner") || lowerMessage.includes("newbie")) {
    skillLevel = "Beginner";
  } else if (
    lowerMessage.includes("advanced") ||
    lowerMessage.includes("expert")
  ) {
    skillLevel = "Advanced";
  }

  // Topic detection
  if (lowerMessage.includes("python")) {
    topic = "Python";
  } else if (lowerMessage.includes("marketing")) {
    topic = "Marketing";
  } else if (lowerMessage.includes("javascript")) {
    topic = "JavaScript";
  } else if (lowerMessage.includes("data science")) {
    topic = "Data Science";
  }

  // Rating detection
  if (lowerMessage.includes("highly rated") || lowerMessage.includes("best")) {
    minRating = 4.5;
  }

  return { category, maxPrice, skillLevel, topic, minRating };
}

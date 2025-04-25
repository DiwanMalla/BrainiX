import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ChatRequestBody {
  message: string;
  courseId?: string;
}

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

    // Base context about BrainiX
    let context = `
      You are a smart helper for the BrainiX e-learning platform, a modern online learning site offering courses in technology, business, design, and more.
      Provide concise, accurate answers about the platform, its features, and courses.
      BrainiX features:
      - Diverse courses with expert instructors.
      - Personalized learning paths and progress tracking.
      - Community forums and live Q&A sessions.
      - Affordable pricing with free introductory modules.
      When users ask about courses, include details like title, price (in USD), duration (in hours), rating (out of 5), category, instructor, and enrollment count.
      For course queries, list up to 3 relevant courses with their details and enrollment links (/courses/[slug]).
      For general site questions (e.g., "What is BrainiX?", "How to enroll?"), provide detailed explanations.
      If a course ID is provided, include specific course details.
      For personalized recommendations, consider user query keywords (e.g., "beginner", "advanced").
      Encourage users to explore courses or contact support for more info.
    `;

    // Fetch specific course if courseId is provided
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
            instructor: true,
            enrollmentCount: true,
            slug: true,
          },
        });
        if (course) {
          context += `
            Specific course details:
            - Title: ${course.title}
            - Price: $${course.price.toFixed(2)}
            - Duration: ${course.duration} hours
            - Rating: ${course.rating.toFixed(1)}/5
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
    let courseResponse = "";
    if (
      message.toLowerCase().includes("course") ||
      message.toLowerCase().includes("class") ||
      message.toLowerCase().includes("learn")
    ) {
      try {
        // Parse query for filters
        let categoryFilter: string | undefined;
        let maxPrice: number | undefined;
        let level: string | undefined;
        if (message.toLowerCase().includes("technology"))
          categoryFilter = "Technology";
        if (message.toLowerCase().includes("business"))
          categoryFilter = "Business";
        if (message.toLowerCase().includes("design")) categoryFilter = "Design";
        if (message.match(/under \$?(\d+)/i)) {
          maxPrice = parseInt(message.match(/under \$?(\d+)/i)![1]);
        }
        if (message.toLowerCase().includes("beginner")) level = "Beginner";
        if (message.toLowerCase().includes("advanced")) level = "Advanced";

        // Fetch courses from Prisma
        const courses = await prisma.course.findMany({
          where: {
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(maxPrice ? { price: { lte: maxPrice } } : {}),
            ...(level ? { level } : {}),
          },
          select: {
            title: true,
            price: true,
            duration: true,
            rating: true,
            category: true,
            instructor: true,
            enrollmentCount: true,
            slug: true,
          },
          take: 3,
          orderBy: { rating: "desc" }, // Sort by rating
        });

        if (courses.length > 0) {
          courseResponse = "Here are some available courses:\n";
          courses.forEach((course) => {
            courseResponse += `
              - **${course.title}**
                - Price: $${course.price.toFixed(2)}
                - Duration: ${course.duration} hours
                - Rating: ${course.rating.toFixed(1)}/5
                - Category: ${course.category}
                - Instructor: ${course.instructor}
                - Enrollments: ${course.enrollmentCount}
                - Enroll: /courses/${course.slug}
            `;
          });
        } else {
          courseResponse =
            "No courses found matching your criteria. Try a different category, price range, or level (e.g., beginner, advanced).";
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
      User: ${message}
    `;

    // Call Google Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      throw new Error("No response from Gemini API");
    }

    return NextResponse.json({ reply }, { status: 200 });
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
    }
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

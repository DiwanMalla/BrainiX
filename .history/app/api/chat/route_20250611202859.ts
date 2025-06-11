import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import prisma from "@/lib/db";
import { CourseLevel } from "@/types/globals";

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
  html: string;
  enrollmentCount: number;
  instructor: string;
  thumbnail: string;
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
      You are an intelligent assistant for the BrainiX e-learning platform, offering courses in technology, business, design, and more.
      Provide concise, accurate, and engaging answers about the platform and its features.
      BrainiX courses include details like title, price (in USD), duration (in hours), rating (out of 5), category, and slug.
      When users ask about courses, return relevant course details in a structured format.
      If a course ID is provided, include specific course details.
      For general course queries, suggest up to 3 relevant courses based on the user's intent (e.g., category, price, skill level, or specific topics like "Python").
      Encourage users to enroll via the platform's course pages (/courses/[slug]).
      Detect user intent (e.g., "cheap" for low price, "beginner" for entry-level, specific topics like "Python", "Marketing").
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
          },
        });
        if (course) {
          context += `
            Specific course details:
            - Title: ${course.title}
            - Price: $${course.price.toFixed(2)}
            - Duration: ${course.duration} hours
            - Rating: ${
              course.rating !== null && course.rating !== undefined
                ? course.rating.toFixed(1)
                : "N/A"
            }/5
            - Category: ${course.category}
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
    if (message.toLowerCase().match(/course|class|learn|study|training/)) {
      try {
        // Parse query for filters
        let categoryFilter: string | undefined;
        let maxPrice: number | undefined;
        let skillLevel: string | undefined;
        let topic: string | undefined;

        // Category detection
        if (
          message.toLowerCase().includes("technology") ||
          message.toLowerCase().includes("tech")
        ) {
          categoryFilter = "Technology";
        } else if (message.toLowerCase().includes("business")) {
          categoryFilter = "Business";
        } else if (message.toLowerCase().includes("design")) {
          categoryFilter = "Design";
        }

        // Price detection
        if (message.match(/under \$?(\d+)/i)) {
          maxPrice = parseInt(message.match(/under \$?(\d+)/i)![1]);
        } else if (
          message.toLowerCase().includes("cheap") ||
          message.toLowerCase().includes("affordable")
        ) {
          maxPrice = 50;
        }

        // Skill level detection
        if (
          message.toLowerCase().includes("beginner") ||
          message.toLowerCase().includes("newbie")
        ) {
          skillLevel = "Beginner";
        } else if (
          message.toLowerCase().includes("advanced") ||
          message.toLowerCase().includes("expert")
        ) {
          skillLevel = "Advanced";
        }

        // Topic detection
        if (message.toLowerCase().includes("python")) {
          topic = "Python";
        } else if (message.toLowerCase().includes("marketing")) {
          topic = "Marketing";
        } else if (message.toLowerCase().includes("javascript")) {
          topic = "JavaScript";
        }

        // Fetch courses from Prisma
        const courses = await prisma.course.findMany({
          where: {
            ...(categoryFilter
              ? { category: { is: { name: categoryFilter } } }
              : {}),
            ...(maxPrice ? { price: { lte: maxPrice } } : {}),
            ...(skillLevel
              ? { level: { equals: skillLevel as CourseLevel } }
              : {}),
            ...(topic
              ? { title: { contains: topic, mode: "insensitive" } }
              : {}),
          },
          select: {
            title: true,
            price: true,
            duration: true,
            rating: true,
            category: {
              select: {
                name: true,
              },
            },
            slug: true,
            _count: {
              select: {
                enrollments: true,
              },
            },
            instructor: {
              select: {
                name: true,
              },
            },
            thumbnail: true,
          },
          take: 3,
        });

        if (courses.length > 0) {
          courseCards = courses.map((course) => {
            const html = `
              <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src="${course.thumbnail || ""}" alt="${
              course.title
            } thumbnail" class="w-full h-32 object-cover rounded mb-2" />
                <h3 class="text-lg font-semibold text-gray-800">${
                  course.title
                }</h3>
                <p class="text-sm text-gray-600">Instructor: ${
                  course.instructor?.name || "Unknown"
                }</p>
                <p class="text-sm text-gray-600">Price: $${course.price.toFixed(
                  2
                )}</p>
                <p class="text-sm text-gray-600">Duration: ${
                  course.duration
                } hours</p>
                <p class="text-sm text-gray-600">Rating: ${
                  course.rating?.toFixed(1) || "N/A"
                }/5</p>
                <p class="text-sm text-gray-600">Category: ${
                  course.category?.name || "Uncategorized"
                }</p>
                <p class="text-sm text-gray-600">Enrolled: ${
                  course._count?.enrollments || 0
                }</p>
                <a href="/courses/${
                  course.slug
                }" class="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Enroll Now</a>
              </div>
            `;
            courseResponse += `
              - **${course.title}**
                - Instructor: ${course.instructor?.name || "Unknown"}
                - Price: $${course.price.toFixed(2)}
                - Duration: ${course.duration} hours
                - Rating: ${course.rating?.toFixed(1) || "N/A"}/5
                - Category: ${course.category?.name || "Uncategorized"}
                - Enrolled: ${course._count?.enrollments || 0}
                - Enroll: /courses/${course.slug}
            `;
            return {
              title: course.title,
              price: course.price,
              duration: course.duration,
              rating: course.rating,
              category: course.category?.name || "Uncategorized",
              slug: course.slug,
              html,
              enrollmentCount: course._count?.enrollments || 0,
              instructor: course.instructor?.name || "Unknown",
              thumbnail: course.thumbnail || "",
            };
          });
        } else {
          courseResponse =
            "No courses found matching your criteria. Try asking for a specific category, topic, or price range!";
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
      Provide a concise and helpful response. If courses are relevant, mention that course recommendations are provided separately.
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
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      throw new Error("No response from Gemini API");
    }

    return NextResponse.json({ reply, courses: courseCards }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in chat API:", error);
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 403) {
        return NextResponse.json(
          { error: "Invalid Gemini API key or insufficient permissions" },
          { status: 403 }
        );
      } else if (error.response.status === 429) {
        return NextResponse.json(
          { error: "Gemini API rate limit exceeded. Try again later." },
          { status: 429 }
        );
      } else if (error.response.status === 400) {
        return NextResponse.json(
          { error: "Invalid request to Gemini API. Please check your input." },
          { status: 400 }
        );
      }
    } else if (error instanceof Error && error.message.includes("403")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key or insufficient permissions" },
        { status: 403 }
      );
    } else if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Gemini API rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else if (error instanceof Error && error.message.includes("400")) {
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

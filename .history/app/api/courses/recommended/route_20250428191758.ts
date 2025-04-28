import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const excludeSlug = searchParams.get("excludeSlug");
  const userSearch = searchParams.get("search") || ""; // Example: Capture user search query
  const userId = searchParams.get("userId"); // Optional: For user-specific recommendations

  try {
    // Step 1: Fetch user activity (e.g., recently viewed courses or cart items)
    let userActivity = [];
    if (userId) {
      // Example: Fetch user's recently viewed courses or cart items from Prisma
      userActivity = await prisma.userActivity.findMany({
        where: { userId },
        select: { courseId: true },
        take: 5,
      });
    }

    // Step 2: Prepare context for Grok API
    const context = {
      searchQuery: userSearch,
      viewedCourses: userActivity.map((activity) => activity.courseId),
      excludeSlug,
    };

    // Step 3: Call Grok API for recommendations
    const grokResponse = await axios.post(
      "https://api.x.ai/v1/recommendations", // Replace with actual Grok API endpoint
      {
        prompt: `Based on the user's search query "${
          context.searchQuery
        }" and viewed courses ${JSON.stringify(
          context.viewedCourses
        )}, recommend 3 relevant courses. Exclude course with slug "${
          context.excludeSlug
        }".`,
        model: "grok-3",
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 4: Parse Grok API response (adjust based on actual API response format)
    const recommendedCourseIds = grokResponse.data.recommendations || []; // Example: ["courseId1", "courseId2", "courseId3"]

    // Step 5: Fetch recommended courses from Prisma
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        id: { in: recommendedCourseIds },
        slug: { not: excludeSlug || undefined },
      },
      include: {
        instructor: true,
        category: true,
      },
      take: 3,
      orderBy: { totalStudents: "desc" },
    });

    // Step 6: Format courses for frontend
    const formattedCourses = courses.map((course) => {
      const discount =
        course.discountPrice && course.price > 0
          ? Math.round(
              ((course.price - course.discountPrice) / course.price) * 100
            )
          : undefined;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || "",
        price: course.price,
        discount,
        thumbnail:
          course.thumbnail && course.thumbnail !== ""
            ? course.thumbnail
            : "/placeholder.svg",
        instructor: course.instructor?.name || "Unknown Instructor",
        rating: course.rating || 0,
        bestseller: course.bestseller,
        category: course.category?.name || "Uncategorized",
        level: course.level,
        students: course.totalStudents || 0, // Add students field
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended courses" },
      { status: 500 }
    );
  }
}

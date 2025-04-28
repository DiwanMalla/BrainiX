import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const excludeSlug = searchParams.get("excludeSlug");

  try {
    // Fetch user activity (e.g., cart items)
    let cartItems: string[] = [];
    try {
      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        cartItems = cartData.map((item: { id: string }) => item.id);
      }
    } catch (error) {
      console.warn("Failed to fetch cart items:", error);
    }

    // Prepare user context for Grok API
    const userContext = {
      cartItems,
      excludeSlug: excludeSlug || "",
      // Add more context if available, e.g., search history or viewed courses
      // searchHistory: ["python", "web development"],
      // viewedCourses: ["course-slug-1", "course-slug-2"],
    };

    // Call Grok API for recommendations
    let grokRecommendations: any[] = [];
    try {
      const response = await axios.post(
        "https://api.x.ai/v1/recommendations", // Replace with actual Grok API endpoint
        {
          context: userContext,
          maxRecommendations: 3,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      grokRecommendations = response.data.recommendations || [];
    } catch (error) {
      console.error("Error fetching Grok API recommendations:", error);
      // Fallback to Prisma logic if Grok API fails
    }

    // Map Grok recommendations to course slugs or IDs
    const recommendedCourseIds = grokRecommendations.map(
      (rec: any) => rec.courseId
    );

    // Fetch courses from Prisma (either Grok-recommended or fallback)
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        slug: { not: excludeSlug || undefined },
        id:
          recommendedCourseIds.length > 0
            ? { in: recommendedCourseIds }
            : undefined,
      },
      include: {
        instructor: true,
        category: true,
      },
      take: 3,
      orderBy:
        recommendedCourseIds.length > 0 ? undefined : { totalStudents: "desc" },
    });

    // Format courses for frontend
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
        students: course.totalStudents || 0, // Ensure students field is included
      };
    });

    // Filter out courses already in cart
    const filteredCourses = formattedCourses.filter(
      (course) => !cartItems.includes(course.id.toString())
    );

    return NextResponse.json(filteredCourses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended courses" },
      { status: 500 }
    );
  }
}

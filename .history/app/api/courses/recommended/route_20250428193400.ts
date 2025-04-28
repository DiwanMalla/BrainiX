import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface RecommendedCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  discount?: number;
  thumbnail: string;
  instructor: string;
  rating: number;
  bestseller: boolean;
  category: string;
  level: string;
  students: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const excludeSlug = searchParams.get("excludeSlug");
  const userId = searchParams.get("userId");

  // Validate inputs
  if (excludeSlug && typeof excludeSlug !== "string") {
    return NextResponse.json({ error: "Invalid excludeSlug" }, { status: 400 });
  }
  if (userId && typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    // Fetch user activity
    let cartItems: string[] = [];
    let wishlistItems: string[] = [];
    let interests: string[] = [];

    if (userId) {
      // Fetch cart
      const cart = await prisma.cart.findMany({
        where: { userId },
        select: { courseId: true },
      });
      cartItems = cart.map((item) => item.courseId);

      // Fetch wishlist
      const wishlist = await prisma.wishlist.findMany({
        where: { userId },
        select: { courseId: true },
      });
      wishlistItems = wishlist.map((item) => item.courseId);

      // Fetch student profile interests
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { interests: true },
      });
      interests = studentProfile?.interests || [];
    }

    // Prepare prompt for Groq API
    const prompt = `
      You are an AI assistant tasked with recommending online course categories based on user activity.
      User context:
      - Courses in cart: ${cartItems.length ? cartItems.join(", ") : "None"}
      - Courses in wishlist: ${
        wishlistItems.length ? wishlistItems.join(", ") : "None"
      }
      - Interests: ${interests.length ? interests.join(", ") : "None"}
      - Exclude course slug: ${excludeSlug || "None"}

      Recommend 3 course categories that align with the user's interests and activity.
      Return the response in JSON format:
      {
        "categories": ["category1", "category2", "category3"]
      }
    `;

    let recommendedCategories: string[] = [];
    try {
      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      recommendedCategories = response.categories || [];
    } catch (error) {
      console.error("Grok API error:", error);
      // Fallback to default categories
      recommendedCategories = [
        "Programming",
        "Web Development",
        "Data Science",
      ];
    }

    // Fetch courses from Prisma
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        slug: { not: excludeSlug || undefined },
        id: { notIn: [...cartItems, ...wishlistItems] },
        OR: recommendedCategories.map((category) => ({
          category: { name: { contains: category, mode: "insensitive" } },
        })),
      },
      include: {
        instructor: true,
        category: true,
      },
      take: 3,
      orderBy: { totalStudents: "desc" },
    });

    // Format courses for frontend
    const formattedCourses: RecommendedCourse[] = courses.map((course) => {
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
        thumbnail: course.thumbnail || "/placeholder.svg",
        instructor: course.instructor?.name || "Unknown Instructor",
        rating: course.rating || 0,
        bestseller: course.bestseller,
        category: course.category?.name || "Uncategorized",
        level: course.level,
        students: course.totalStudents || 0,
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

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { CourseLevel } from "@/types/globals";

interface Filters {
  search?: string;
  category?: string;
  level?: string;
  priceRange?: number[];
  duration?: string;
  subtitles?: boolean;
  certificate?: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: Filters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    level: searchParams.get("level") || undefined,
    priceRange:
      searchParams.get("priceRange")?.split(",").map(Number) || undefined,
    duration: searchParams.get("duration") || undefined,
    subtitles: searchParams.get("subtitles") === "true" || undefined,
    certificate: searchParams.get("certificate") === "true" || undefined,
  };

  // Validate and normalize level filter
  const validLevels: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const normalizedLevel = filters.level
    ? (filters.level.toUpperCase() as CourseLevel)
    : undefined;
  const isValidLevel = normalizedLevel && validLevels.includes(normalizedLevel);

  try {
    const courses = await prisma.course.findMany({
      where: {
        ...(filters.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            {
              shortDescription: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
            {
              instructor: {
                name: { contains: filters.search, mode: "insensitive" },
              },
            },
            {
              category: {
                name: { contains: filters.search, mode: "insensitive" },
              },
            },
          ],
        }),
        ...(filters.category &&
          filters.category !== "all" && {
            category: {
              name: { equals: filters.category, mode: "insensitive" },
            },
          }),
        ...(isValidLevel && {
          level: { equals: normalizedLevel },
        }),
        ...(filters.priceRange && {
          price: {
            gte: filters.priceRange[0],
            lte: filters.priceRange[1],
          },
        }),
        ...(filters.duration &&
          filters.duration !== "any" && {
            duration: {
              ...(filters.duration === "short" && {
                lte: 4 * 7 * 24 * 60 * 60,
              }), // 4 weeks in seconds
              ...(filters.duration === "medium" && {
                gt: 4 * 7 * 24 * 60 * 60,
                lte: 8 * 7 * 24 * 60 * 60,
              }),
              ...(filters.duration === "long" && { gt: 8 * 7 * 24 * 60 * 60 }),
            },
          }),
        ...(filters.subtitles && {
          subtitlesLanguages: { isEmpty: false },
        }),
        ...(filters.certificate && {
          certificateAvailable: true,
        }),
      },
      include: {
        instructor: true,
        category: true,
      },
      orderBy: { totalStudents: "desc" },
      take: 9, // Limit to 9 courses per page (you can add pagination later)
    });
    console.log("Courses found:", courses);
    const formattedCourses = courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      instructor: course.instructor.name,
      rating: course.rating || 0,
      students: course.totalStudents || 0,
      price: course.price,
      image: course.thumbnail || "/placeholder.svg",
      discount: course.discountPrice
        ? Math.round(
            ((course.price - course.discountPrice) / course.price) * 100
          )
        : undefined,
      bestseller: course.bestseller,
      category: course.category.name,
      level: course.level,
      shortDescription: course.shortDescription || "",
      duration: course.duration,
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

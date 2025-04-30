import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").pop(); // Extract slug from the URL path

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        courses: {
          where: { published: true },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            thumbnail: true,
            price: true,
            discountPrice: true,
            level: true,
            duration: true,
            totalStudents: true,
            rating: true,
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || null,
      image: category.image || "/placeholder.svg",
      featured: category.featured,
      subcategories: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description || "",
        image: child.image || "/placeholder.svg",
      })),
      courses: category.courses.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || "",
        thumbnail: course.thumbnail || "/placeholder.svg",
        price: course.price,
        discount: course.discountPrice
          ? Math.round(
              ((course.price - course.discountPrice) / course.price) * 100
            )
          : undefined,
        discountPrice: course.discountPrice || undefined,
        instructor: course.instructor.name || "Unknown Instructor",
        duration: course.duration
          ? `${Math.floor(course.duration / 3600)}:${Math.floor(
              (course.duration % 3600) / 60
            )} hrs`
          : "N/A",
        studentsCount: course.totalStudents || 0,
        rating: course.rating || 0,
        level: course.level,
      })),
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
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
            instructor: true, // Assuming these fields exist or will be added
            duration: true,

            rating: true,
            level: true,
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
      subcategories: (category.children || []).map((child) => ({
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
        instructor: course.instructor || "Expert Instructor", // Mock if not in schema
        duration:
          course.duration || `${Math.floor(Math.random() * 20) + 5} hours`, // Mock
        studentsCount:
          course.studentsCount || Math.floor(Math.random() * 10000) + 500, // Mock
        rating: course.rating || Number((Math.random() * 2 + 3).toFixed(1)), // Mock 3.0-5.0
        level:
          course.level ||
          ["Beginner", "Intermediate", "Advanced"][
            Math.floor(Math.random() * 3)
          ], // Mock
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

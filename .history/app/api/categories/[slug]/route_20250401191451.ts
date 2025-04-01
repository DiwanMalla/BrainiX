import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Top-level categories only
        courses: { some: { published: true } }, // Ensure at least one published course
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
          },
        },
        courses: {
          where: { published: true },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            thumbnail: true,
          },
          take: 3, // Limit to 3 courses per category
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedCategories = categories.map((category) => ({
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
      courses: (category.courses || []).map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || "",
        thumbnail: course.thumbnail || "/placeholder.svg",
      })),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching full categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

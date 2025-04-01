import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { courses: { some: { published: true } } }, // Only fetch categories with published courses
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories.map((cat) => cat.name));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

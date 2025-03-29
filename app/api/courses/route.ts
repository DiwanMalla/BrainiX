import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        discountPrice: true,
        thumbnail: true,
        previewVideo: true,
        level: true,
        status: true,
        featured: true,
        bestseller: true,
        published: true,
        publishedAt: true,
        language: true,
        subtitlesLanguages: true,
        duration: true,
        totalLessons: true,
        totalModules: true,
        requirements: true,
        learningObjectives: true,
        targetAudience: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

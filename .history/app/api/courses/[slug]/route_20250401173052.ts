import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { params } = searchParams;
  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.slug, published: true },
      include: {
        instructor: true,
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const discount =
      course.discountPrice && course.price > 0
        ? Math.round(
            ((course.price - course.discountPrice) / course.price) * 100
          )
        : undefined;

    const formattedCourse = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDescription: course.shortDescription || "",
      price: course.price,
      discount,
      discountPrice: course.discountPrice || undefined,
      thumbnail: course.thumbnail || "/placeholder.svg",
      rating: course.rating || 0,
      students: course.totalStudents || 0,
      category: course.category?.name || "Uncategorized",
      level: course.level,
      duration: course.duration ? `${course.duration} hours` : "Unknown",
      language: course.language,
      lastUpdated: course.updatedAt.toLocaleDateString(),
      instructor: {
        name: course.instructor?.name || "Unknown Instructor",
        image: course.instructor?.image || "/placeholder.svg",
        bio: course.instructor?.bio || "No bio available",
      },
      whatYoullLearn: course.learningObjectives || [],
      syllabus: course.modules.map((module) => ({
        title: module.title,
        lectures: module.lessons?.length || 0,
        duration: module.duration ? `${module.duration} mins` : "Unknown",
      })),
      topCompanies: course.topCompanies || [],
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

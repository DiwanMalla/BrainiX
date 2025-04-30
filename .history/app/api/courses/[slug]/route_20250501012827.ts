import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Course } from "@prisma/client";
type Params = Promise<{ slug: string }>;
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing course slug" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: { slug, published: true },
      include: {
        instructor: {
          include: {
            instructorProfile: true, // Include instructorProfile
          },
        },
        category: true,
        modules: {
          include: { lessons: true },
        },
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

    const formattedCourse: Course = {
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
      duration: course.duration
        ? `${Math.floor(course.duration / 3600)}h ${Math.floor(
            (course.duration % 3600) / 60
          )}m`
        : "Unknown",
      language: course.language,
      lastUpdated: course.updatedAt.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      instructor: {
        id: course.instructor?.id, // Include instructor ID for fallback fetch
        name: course.instructor?.name || "Unknown Instructor",
        image: course.instructor?.image || "/placeholder.svg",
        bio: course.instructor?.instructorProfile?.biography || "", // Use biography from instructorProfile
        instructorProfile: course.instructor?.instructorProfile
          ? {
              title: course.instructor.instructorProfile.title,
              specialization:
                course.instructor.instructorProfile.specialization,
              biography: course.instructor.instructorProfile.biography,
              averageRating: course.instructor.instructorProfile.averageRating,
              totalStudents: course.instructor.instructorProfile.totalStudents,
              socialLinks: course.instructor.instructorProfile.socialLinks,
            }
          : undefined,
      },
      whatYoullLearn: Array.isArray(course.learningObjectives)
        ? course.learningObjectives
        : [],
      syllabus: course.modules.map((module) => ({
        title: module.title,
        lectures: module.lessons?.length || 0,
        duration: module.lessons?.length
          ? `${Math.floor(
              module.lessons.reduce(
                (total, lesson) => total + (lesson.duration || 0),
                0
              ) / 60
            )}m`
          : "Unknown",
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

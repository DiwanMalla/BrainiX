import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface Params {
  params: { slug: string };
}
interface ModuleInput {
  id?: string;
  title: string;
  description: string;
  lessons: LessonInput[];
  position?: number;
}
interface LessonInput {
  id?: string;
  title: string;
  description: string;
  content: string;
  type: string;
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
  position?: number;
}

export async function GET(_req: Request, { params }: Params) {
  if (!params?.slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const { slug } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  if (!params?.slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const { slug } = params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    title,
    shortDescription,
    description,
    price,
    discountPrice,
    modules,
  } = await req.json();

  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (course.instructorId !== user.id || user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Unauthorized to edit this course" },
        { status: 403 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        modules: modules
          ? {
              upsert: modules.map((module: ModuleInput, index: number) => ({
                where: { id: module.id || "" },
                update: {
                  title: module.title,
                  description: module.description,
                  position: index,
                  lessons: {
                    upsert: module.lessons.map(
                      (lesson: LessonInput, lessonIndex: number) => ({
                        where: { id: lesson.id || "" },
                        update: {
                          title: lesson.title,
                          description: lesson.description,
                          content: lesson.content,
                          type: lesson.type,
                          videoUrl: lesson.videoUrl,
                          duration: lesson.duration,
                          isPreview: lesson.isPreview,
                          position: lessonIndex,
                        },
                        create: {
                          id: lesson.id,
                          title: lesson.title,
                          description: lesson.description,
                          content: lesson.content,
                          type: lesson.type,
                          videoUrl: lesson.videoUrl,
                          duration: lesson.duration,
                          isPreview: lesson.isPreview,
                          position: lessonIndex,
                        },
                      })
                    ),
                    deleteMany: {
                      id: {
                        notIn: module.lessons.map((l: LessonInput) => l.id),
                      },
                    },
                  },
                },
                create: {
                  id: module.id,
                  title: module.title,
                  description: module.description,
                  position: index,
                  lessons: {
                    create: module.lessons.map(
                      (lesson: LessonInput, lessonIndex: number) => ({
                        id: lesson.id,
                        title: lesson.title,
                        description: lesson.description,
                        content: lesson.content,
                        type: lesson.type,
                        videoUrl: lesson.videoUrl,
                        duration: lesson.duration,
                        isPreview: lesson.isPreview,
                        position: lessonIndex,
                      })
                    ),
                  },
                },
              })),
              deleteMany: {
                id: { notIn: modules.map((m: ModuleInput) => m.id) },
              },
            }
          : undefined,
      },
      include: {
        modules: {
          include: { lessons: true },
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      {
        error: "Failed to update course",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

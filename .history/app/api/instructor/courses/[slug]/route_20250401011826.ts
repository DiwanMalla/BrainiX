import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: { instructor: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;
  const { title, shortDescription, description, price, discountPrice } =
    await req.json();

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (course.instructorId !== user?.id || user?.role !== "INSTRUCTOR") {
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
        discount: discount ? parseFloat(discount) : 0,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

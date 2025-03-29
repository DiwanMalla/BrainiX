import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust path to your Prisma client

interface Params {
  slug: string;
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const body = await req.json();
    const { slug } = params;

    // Update course in Prisma (assuming a Course model exists)
    const updatedCourse = await prisma.course.update({
      where: { slug },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        price: parseFloat(body.price),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

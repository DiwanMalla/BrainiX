import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cart = await prisma.cart.findMany({
      where: { user: { clerkId: userId } },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            price: true,
            instructor: { select: { name: true } },
          },
        },
      },
    });

    const formattedCart = cart.map((item) => ({
      id: item.course.id,
      slug: item.course.slug,
      title: item.course.title,
      thumbnail: item.course.thumbnail || "/placeholder.svg",
      price: item.course.price,
      instructor: { name: item.course.instructor.name || "Unknown" },
    }));

    return NextResponse.json(formattedCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await request.json();
  if (!courseId)
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    await prisma.cart.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId },
      update: {},
    });

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await request.json();
  if (!courseId)
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });

  try {
    await prisma.cart.delete({
      where: { userId_courseId: { userId, courseId } },
    });
    return NextResponse.json({ message: "Removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}

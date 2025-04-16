import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
            discountPrice: true,
            instructor: { select: { name: true } },
            rating: true,
            totalStudents: true,
            duration: true,
            level: true,
            totalLessons: true,
            totalModules: true,
            shortDescription: true,
            tags: true,
            language: true,
            subtitlesLanguages: true,
            certificateAvailable: true,
            published: true,
            featured: true,
            bestseller: true,
          },
        },
      },
      orderBy: { addedAt: "desc" }, // Sort by when it was added to cart
    });
    // Filter out cart items with missing course data
    const validCart = cart.filter((item) => item.course !== null);
    const formattedCart = cart.map((item) => ({
      id: item.course.id,
      slug: item.course.slug,
      title: item.course.title,
      thumbnail: item.course.thumbnail || "/placeholder.svg",
      price: item.course.price,
      discountPrice: item.course.discountPrice || null,
      instructor: { name: item.course.instructor.name || "Unknown" },
      rating: item.course.rating || 0,
      totalStudents: item.course.totalStudents || 0,
      duration: item.course.duration || 0,
      level: item.course.level || "BEGINNER",
      totalLessons: item.course.totalLessons || 0,
      totalModules: item.course.totalModules || 0,
      shortDescription: item.course.shortDescription || "",
      tags: item.course.tags || [],
      language: item.course.language || "English",
      subtitlesLanguages: item.course.subtitlesLanguages || [],
      certificateAvailable: item.course.certificateAvailable,
      published: item.course.published,
      featured: item.course.featured,
      bestseller: item.course.bestseller,
      addedAt: item.addedAt,
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
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  try {
    const existingCartItem = await prisma.cart.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingCartItem) {
      return NextResponse.json(
        { message: "Course already in cart" },
        { status: 200 }
      );
    }

    const cartItem = await prisma.cart.create({
      data: {
        user: { connect: { clerkId: userId } },
        course: { connect: { id: courseId } },
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            price: true,
            discountPrice: true,
            instructor: { select: { name: true } },
            rating: true,
            totalStudents: true,
            duration: true,
            level: true,
            totalLessons: true,
            totalModules: true,
            shortDescription: true,
            tags: true,
            language: true,
            subtitlesLanguages: true,
            certificateAvailable: true,
            published: true,
            featured: true,
            bestseller: true,
          },
        },
      },
    });

    const formattedItem = {
      id: cartItem.course.id,
      slug: cartItem.course.slug,
      title: cartItem.course.title,
      thumbnail: cartItem.course.thumbnail || "/placeholder.svg",
      price: cartItem.course.price,
      discountPrice: cartItem.course.discountPrice || null,
      instructor: { name: cartItem.course.instructor.name || "Unknown" },
      rating: cartItem.course.rating || 0,
      totalStudents: cartItem.course.totalStudents || 0,
      duration: cartItem.course.duration || 0,
      level: cartItem.course.level || "BEGINNER",
      totalLessons: cartItem.course.totalLessons || 0,
      totalModules: cartItem.course.totalModules || 0,
      shortDescription: cartItem.course.shortDescription || "",
      tags: cartItem.course.tags || [],
      language: cartItem.course.language || "English",
      subtitlesLanguages: cartItem.course.subtitlesLanguages || [],
      certificateAvailable: cartItem.course.certificateAvailable,
      published: cartItem.course.published,
      featured: cartItem.course.featured,
      bestseller: cartItem.course.bestseller,
      addedAt: cartItem.addedAt,
    };

    return NextResponse.json(formattedItem, { status: 201 });
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
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

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

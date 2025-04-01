import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        user: { clerkId: userId },
      },
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

    const formattedWishlist = wishlist.map((item) => ({
      id: item.course.id,
      slug: item.course.slug,
      title: item.course.title,
      thumbnail: item.course.thumbnail || "/placeholder.svg",
      price: item.course.price,
      instructor: { name: item.course.instructor.name || "Unknown" },
    }));

    return NextResponse.json(formattedWishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();

  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  try {
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: { userId: userId, courseId: courseId },
      },
    });

    if (existingWishlistItem) {
      return NextResponse.json(
        { message: "Course already in wishlist" },
        { status: 200 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
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
            instructor: { select: { name: true } },
          },
        },
      },
    });

    const formattedItem = {
      id: wishlistItem.course.id,
      slug: wishlistItem.course.slug,
      title: wishlistItem.course.title,
      thumbnail: wishlistItem.course.thumbnail || "/placeholder.svg",
      price: wishlistItem.course.price,
      instructor: { name: wishlistItem.course.instructor.name || "Unknown" },
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();

  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  try {
    await prisma.wishlist.delete({
      where: {
        userId_courseId: { userId: userId, courseId: courseId },
      },
    });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}

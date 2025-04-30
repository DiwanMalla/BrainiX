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
        user: { clerkId: userId }, // Assuming clerkId is the field in User model
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
            // Additional fields from your schema
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
      orderBy: {
        addedAt: "desc", // Sort by when it was added to wishlist
      },
    });

    const formattedWishlist = wishlist.map((item) => ({
      id: item.course.id,
      slug: item.course.slug,
      title: item.course.title,
      thumbnail: item.course.thumbnail || "/placeholder.svg",
      price: item.course.price,
      discountPrice: item.course.discountPrice || null,
      instructor: { name: item.course.instructor.name || "Unknown" },
      // Additional fields
      rating: item.course.rating || 0,
      totalStudents: item.course.totalStudents || 0,
      duration: item.course.duration || 0, // In minutes, you might want to format this on the frontend
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
      addedAt: item.addedAt, // Include when it was added to wishlist
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
  const { userId } = await auth();

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
        userId_courseId: { userId, courseId },
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
        user: { connect: { clerkId: userId } }, // Assuming clerkId is the unique identifier
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
            // Additional fields
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
      id: wishlistItem.course.id,
      slug: wishlistItem.course.slug,
      title: wishlistItem.course.title,
      thumbnail: wishlistItem.course.thumbnail || "/placeholder.svg",
      price: wishlistItem.course.price,
      discountPrice: wishlistItem.course.discountPrice || null,
      instructor: { name: wishlistItem.course.instructor.name || "Unknown" },
      // Additional fields
      rating: wishlistItem.course.rating || 0,
      totalStudents: wishlistItem.course.totalStudents || 0,
      duration: wishlistItem.course.duration || 0,
      level: wishlistItem.course.level || "BEGINNER",
      totalLessons: wishlistItem.course.totalLessons || 0,
      totalModules: wishlistItem.course.totalModules || 0,
      shortDescription: wishlistItem.course.shortDescription || "",
      tags: wishlistItem.course.tags || [],
      language: wishlistItem.course.language || "English",
      subtitlesLanguages: wishlistItem.course.subtitlesLanguages || [],
      certificateAvailable: wishlistItem.course.certificateAvailable,
      published: wishlistItem.course.published,
      featured: wishlistItem.course.featured,
      bestseller: wishlistItem.course.bestseller,
      addedAt: wishlistItem.addedAt,
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
  const { userId } = await auth();

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
        userId_courseId: { userId, courseId },
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

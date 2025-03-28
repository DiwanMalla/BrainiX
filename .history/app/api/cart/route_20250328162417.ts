import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

// Define types for better type safety
type Course = {
  id: string;
  slug: string;
  title: string;
  thumbnail: string | null;
  price: number;
  instructor: { name: string | null };
};

type CartItem = {
  course: Course;
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
      include: {
        items: {
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
        },
      },
    });

    // Ensure type safety in mapping
    const courses: Course[] =
      cartItems?.items.map((item: CartItem) => ({
        ...item.course,
        instructor: {
          ...item.course.instructor,
          name: item.course.instructor.name || "Unknown",
        },
      })) || [];

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

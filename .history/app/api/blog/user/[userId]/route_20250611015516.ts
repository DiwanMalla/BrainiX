import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        ...(status && { status: status.toUpperCase() }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG_USER_POSTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Schema for post validation
const postSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: userId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    console.error("[BLOG_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

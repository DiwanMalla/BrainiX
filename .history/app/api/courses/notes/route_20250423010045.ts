import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const CreateNoteSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
  content: z
    .string()
    .min(1, "Note content is required")
    .max(5000, "Note exceeds maximum length"),
});

const UpdateNoteSchema = z.object({
  noteId: z.string().min(1, "Note ID is required"),
  content: z
    .string()
    .min(1, "Note content is required")
    .max(5000, "Note exceeds maximum length"),
});

const DeleteNoteSchema = z.object({
  noteId: z.string().min(1, "Note ID is required"),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = CreateNoteSchema.parse(body);

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: input.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const note = await prisma.note.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: input.lessonId,
        content: input.content,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error("Error creating note:", {
      error: error.message,
      stack: error.stack,
      userId,
      requestBody: await request.json().catch(() => "Invalid JSON"),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create note", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  if (!courseId || !lessonId) {
    return NextResponse.json(
      { error: "Missing courseId or lessonId" },
      { status: 400 }
    );
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const notes = await prisma.note.findMany({
      where: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching notes:", {
      error: error.message,
      stack: error.stack,
      userId,
      courseId,
      lessonId,
    });
    return NextResponse.json(
      { error: "Failed to fetch notes", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = UpdateNoteSchema.parse(body);

    const note = await prisma.note.findUnique({
      where: { id: input.noteId },
      include: { enrollment: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.enrollment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: input.noteId },
      data: {
        content: input.content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error: any) {
    console.error("Error updating note:", {
      error: error.message,
      stack: error.stack,
      userId,
      requestBody: await request.json().catch(() => "Invalid JSON"),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update note", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = DeleteNoteSchema.parse(body);

    const note = await prisma.note.findUnique({
      where: { id: input.noteId },
      include: { enrollment: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.enrollment.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.note.delete({
      where: { id: input.noteId },
    });

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting note:", {
      error: error.message,
      stack: error.stack,
      userId,
      requestBody: await request.json().catch(() => "Invalid JSON"),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete note", details: error.message },
      { status: 500 }
    );
  }
}

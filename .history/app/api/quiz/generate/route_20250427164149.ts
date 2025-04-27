import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const { lessonId } = await req.json();
    if (!lessonId) {
      return new NextResponse("Lesson ID required", { status: 400 });
    }

    // Fetch lesson and verify enrollment
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    const courseId = lesson.module.course.id;
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: "ACTIVE",
      },
    });
    if (!enrollment) {
      return new NextResponse("Course not purchased", { status: 403 });
    }

    // Fetch lesson content
    const lessonContent = lesson.content || "";
    if (!lessonContent) {
      return new NextResponse("No lesson content available", { status: 400 });
    }

    // Check for existing quiz
    const existingQuiz = await prisma.quiz.findFirst({
      where: { lessonId },
      include: { questions: true },
    });
    if (existingQuiz) {
      return NextResponse.json({
        quizId: existingQuiz.id,
        questions: existingQuiz.questions.map((q) => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options as string),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      });
    }

    // Call Groq Cloud API with Llama 3.1 70B
    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              'You are a quiz generator. Create 5 multiple-choice questions based on the provided lesson content. Each question must have 4 options and one correct answer. Return the response as valid JSON: ```json\n{ "questions": [{ "text": string, "options": string[], "correctAnswer": string, "explanation": string }] }\n```. Ensure the response is only JSON, with no additional text.',
          },
          {
            role: "user",
            content: `Content: ${lessonContent.slice(
              0,
              4000
            )}\nGenerate a quiz.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { questions } = JSON.parse(
      aiResponse.data.choices[0].message.content
    );

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `AI-Generated Quiz for Lesson ${lesson.title}`,
        lessonId,
        passingScore: 70,
      },
    });

    // Save questions
    await prisma.question.createMany({
      data: questions.map((q: any) => ({
        text: q.text,
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
        quizId: quiz.id,
      })),
    });

    return NextResponse.json({ quizId: quiz.id, questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

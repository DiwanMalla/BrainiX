import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const { courseId } = await req.json();
    if (!courseId) {
      return new NextResponse("Course ID required", { status: 400 });
    }

    // Verify course purchase
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

    // Fetch lesson content for the course
    const lessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { content: true },
    });
    const lessonContent = lessons
      .map((lesson) => lesson.content || "")
      .filter(Boolean)
      .join("\n");

    if (!lessonContent) {
      return new NextResponse("No lesson content available", { status: 400 });
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
              'You are a quiz generator. Create 5 multiple-choice questions based on the provided content. Each question must have 4 options and one correct answer. Return the response as valid JSON: ```json\n{ "questions": [{ "text": string, "options": string[], "correctAnswer": string, "explanation": string }] }\n```. Ensure the response is only JSON, with no additional text.',
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

    const { questions } = aiResponse.data.choices[0].message.content;

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `AI-Generated Quiz for Course ${courseId}`,
        lessonId: lessons[0]?.id || "",
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

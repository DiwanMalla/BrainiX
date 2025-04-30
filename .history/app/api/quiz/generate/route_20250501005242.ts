import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      console.error("Quiz Generate: Unauthorized - No userId");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("Quiz Generate: Authenticated user", { userId });

    // Parse request body
    const body = await req.json();
    const { lessonId } = body;
    if (!lessonId || typeof lessonId !== "string") {
      console.error("Quiz Generate: Invalid or missing lessonId", { body });
      return new NextResponse("Lesson ID must be a valid string", {
        status: 400,
      });
    }
    console.log("Quiz Generate: Received lessonId", { lessonId });

    // Fetch lesson and verify enrollment
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) {
      console.error("Quiz Generate: Lesson not found", { lessonId });
      return new NextResponse("Lesson not found", { status: 404 });
    }
    console.log("Quiz Generate: Lesson fetched", {
      lessonId,
      courseId: lesson.module.course.id,
    });

    const courseId = lesson.module.course.id;
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: "ACTIVE",
      },
    });
    if (!enrollment) {
      console.error("Quiz Generate: No active enrollment", {
        userId,
        courseId,
      });
      return new NextResponse("Course not purchased", { status: 403 });
    }
    console.log("Quiz Generate: Enrollment verified", {
      enrollmentId: enrollment.id,
    });

    // Fetch lesson content or fallback to description
    const lessonContent = lesson.content || lesson.description || "";
    if (!lessonContent) {
      console.warn(
        "Quiz Generate: No lesson content or description, using fallback",
        { lessonId }
      );
    }
    console.log("Quiz Generate: Lesson content fetched", {
      contentLength: lessonContent.length,
    });

    // Check for existing quiz
    const existingQuiz = await prisma.quiz.findFirst({
      where: { lessonId },
      include: { questions: true },
    });
    if (existingQuiz) {
      console.log("Quiz Generate: Returning existing quiz", {
        quizId: existingQuiz.id,
      });
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
    console.log("Quiz Generate: Calling Groq API");
    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              'You are a quiz generator. Create 5 multiple-choice questions based on the provided lesson content. Each question must have 4 options and one correct answer. Return the response as valid JSON: ```json\n{ "questions": [{ "text": string, "options": string[], "correctAnswer": string, "explanation": string }] }\n```. Ensure the response is only JSON, with no additional text. If content is limited, generate general questions about the lesson topic.',
          },
          {
            role: "user",
            content: `Lesson Title: ${lesson.title}\nContent: ${
              lessonContent.slice(0, 4000) ||
              "General knowledge about " + lesson.title
            }\nGenerate a quiz.`,
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

    console.log("Quiz Generate: Groq API responded");
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
    console.log("Quiz Generate: Quiz created", { quizId: quiz.id });

    // Save questions
    await prisma.question.createMany({
      data: questions.map(
        (q: {
          text: string;
          options: string[];
          correctAnswer: string;
          explanation: string;
        }) => ({
          text: q.text,
          type: "MULTIPLE_CHOICE",
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: 1,
          quizId: quiz.id,
        })
      ),
    });
    console.log("Quiz Generate: Questions saved", {
      questionCount: questions.length,
    });

    return NextResponse.json({ quizId: quiz.id, questions });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Quiz Generate: Error", {
        message: error.message,
        stack: error.stack,
        status:
          axios.isAxiosError(error) && error.response
            ? error.response.status
            : undefined,
      });
    } else {
      console.error("Quiz Generate: Unknown error", { error });
    }
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(errorMessage, {
      status: 500,
    });
  }
}

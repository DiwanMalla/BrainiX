import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      console.error("Quiz Submit: Unauthorized - No userId");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("Quiz Submit: Authenticated user", { userId });

    // Parse request body
    const { quizId, answers, courseId } = await req.json();
    if (!quizId || typeof quizId !== "string") {
      console.error("Quiz Submit: Invalid or missing quizId", { quizId });
      return new NextResponse("Quiz ID must be a valid string", {
        status: 400,
      });
    }
    if (!courseId || typeof courseId !== "string") {
      console.error("Quiz Submit: Invalid or missing courseId", { courseId });
      return new NextResponse("Course ID must be a valid string", {
        status: 400,
      });
    }
    if (!answers || typeof answers !== "object") {
      console.error("Quiz Submit: Invalid or missing answers", { answers });
      return new NextResponse("Answers must be provided as an object", {
        status: 400,
      });
    }
    console.log("Quiz Submit: Received submission", {
      quizId,
      courseId,
      answerCount: Object.keys(answers).length,
    });

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: "ACTIVE",
      },
    });
    if (!enrollment) {
      console.error("Quiz Submit: No active enrollment", { userId, courseId });
      return new NextResponse("Course not purchased", { status: 403 });
    }
    console.log("Quiz Submit: Enrollment verified", {
      enrollmentId: enrollment.id,
    });

    // Fetch quiz and questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) {
      console.error("Quiz Submit: Quiz not found", { quizId });
      return new NextResponse("Quiz not found", { status: 404 });
    }
    console.log("Quiz Submit: Quiz fetched", {
      quizId,
      questionCount: quiz.questions.length,
    });

    // Calculate score and prepare results
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const answerRecords: {
      questionId: string;
      answer: string;
      isCorrect: boolean;
    }[] = [];
    const results: {
      questionId: string;
      isCorrect: boolean;
      selectedAnswer: string;
      correctAnswer: string;
      explanation: string;
    }[] = [];

    for (const question of quiz.questions) {
      const submittedAnswer = answers[question.id] || "";
      const isCorrect = submittedAnswer === question.correctAnswer;

      if (isCorrect && submittedAnswer) {
        correctAnswers++;
      }

      answerRecords.push({
        questionId: question.id,
        answer: submittedAnswer,
        isCorrect,
      });

      results.push({
        questionId: question.id,
        isCorrect,
        selectedAnswer: submittedAnswer,
        correctAnswer: question.correctAnswer || "",
        explanation: question.explanation || "No explanation provided.",
      });
    }

    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const passed = score >= quiz.passingScore;
    console.log("Quiz Submit: Score calculated", {
      score,
      passed,
      correctAnswers,
      totalQuestions,
    });

    // Create quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed,
        answers: {
          create: answerRecords.map((record) => ({
            questionId: record.questionId,
            answer: record.answer,
            isCorrect: record.isCorrect,
          })),
        },
      },
    });
    console.log("Quiz Submit: Quiz attempt created", {
      quizAttemptId: quizAttempt.id,
    });

    return NextResponse.json({
      score: Math.round(score),
      passed,
      correctAnswers,
      totalQuestions,
      results,
    });
  } catch (error: any) {
    console.error("Quiz Submit: Error", {
      message: error.message,
      stack: error.stack,
    });
    return new NextResponse(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}

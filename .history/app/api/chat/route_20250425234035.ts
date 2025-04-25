import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface ChatRequestBody {
  message: string;
  courseId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, courseId } = (await req.json()) as ChatRequestBody;

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid or missing message" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Validate user authentication
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch course context if provided
    let context =
      "You are a helpful tutor for the BrainiX e-learning platform, assisting with course-related questions. Provide concise, accurate answers.";
    if (courseId) {
      try {
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/notes?courseId=${courseId}`,
          { headers: { "x-user-id": userId } }
        );
        context += ` Course context: ${
          courseResponse.data.notes || "No notes available."
        }`;
      } catch (error) {
        console.error("Error fetching course notes:", error);
        context += " Course context: No notes available.";
      }
    }

    // Call Google Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: context }, { text: `User: ${message}` }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      throw new Error("No response from Gemini API");
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error("Error in chat API:", error.message, error.response?.data);
    if (error.response?.status === 403 || error.message.includes("403")) {
      return NextResponse.json(
        { error: "Invalid Gemini API key or insufficient permissions" },
        { status: 403 }
      );
    } else if (
      error.response?.status === 429 ||
      error.message.includes("429")
    ) {
      return NextResponse.json(
        { error: "Gemini API rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else if (
      error.response?.status === 400 ||
      error.message.includes("400")
    ) {
      return NextResponse.json(
        { error: "Invalid request to Gemini API. Please check your input." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}

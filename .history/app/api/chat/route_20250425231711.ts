import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import axios from "axios";

interface ChatRequestBody {
  message: string;
  courseId?: string;
}

interface ChatResponse {
  reply: string;
}

const hf = new HfInference(process.env.HF_API_TOKEN);

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
    const apiKey = process.env.HF_API_TOKEN;
    if (!apiKey) {
      console.error("HF_API_TOKEN is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Fetch course context if provided
    let context =
      "You are a helpful tutor for the BrainiX e-learning platform, assisting with course-related questions.";
    if (courseId) {
      try {
        const userId = req.headers.get("x-user-id") || "";
        const courseResponse = await axios.get(
          `http://localhost:3000/api/courses/notes?courseId=${courseId}`,
          {
            headers: { "x-user-id": userId },
          }
        );
        context += ` Course context: ${
          courseResponse.data.notes || "No notes available."
        }`;
      } catch (error) {
        console.error("Error fetching course notes:", error);
      }
    }

    // Call Hugging Face Inference API
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: `${context}\nUser: ${message}`,
      parameters: {
        max_length: 150,
        temperature: 0.7,
      },
    });

    const reply = response.generated_text.split("User:")[0].trim();
    if (!reply) {
      throw new Error("No response content from Hugging Face");
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);

    if (error instanceof Error && error.message.includes("403")) {
      return NextResponse.json(
        { error: "Invalid Hugging Face API token" },
        { status: 403 }
      );
    } else if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Hugging Face API rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to process request. Please try again." },
        { status: 500 }
      );
    }
  }
}

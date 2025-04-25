import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import axios from "axios";

interface ChatRequestBody {
  message: string;
  courseId?: string;
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
    if (!process.env.HF_API_TOKEN) {
      console.error("HF_API_TOKEN is not set");
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

    // Construct chat prompt for Gemma
    const prompt = `<start_of_turn>system\n${context}\n<end_of_turn>\n<start_of_turn>user\n${message}\n<end_of_turn>\n<start_of_turn>assistant\n`;

    // Call Hugging Face textGeneration API
    const response = await hf.textGeneration({
      model: "google/gemma-7b-it",
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false, // Only return generated text
      },
    });

    const reply = response.generated_text?.trim();
    if (!reply) {
      throw new Error("No response from Hugging Face");
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error("Error in chat API:", error.message, error.response?.data);
    if (error.response?.status === 403 || error.message.includes("403")) {
      return NextResponse.json(
        { error: "Invalid Hugging Face API token" },
        { status: 403 }
      );
    } else if (
      error.response?.status === 429 ||
      error.message.includes("429")
    ) {
      return NextResponse.json(
        { error: "Hugging Face API rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else if (
      error.message.includes("Model") ||
      error.message.includes("not supported")
    ) {
      return NextResponse.json(
        { error: "Selected model is not supported for this task." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}

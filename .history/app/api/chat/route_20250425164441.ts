// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

interface ChatRequestBody {
  message: string;
}

interface ChatResponse {
  reply: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { message } = (await req.json()) as ChatRequestBody;

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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Use 'gpt-4o' if you have access
        messages: [
          {
            role: "system",
            content: "You are a helpful tutor for an e-learning platform.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0]?.message?.content as string;
    if (!reply) {
      throw new Error("No response content from OpenAI");
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error calling OpenAI API:",
      axiosError.response?.data || axiosError.message
    );

    if (axiosError.response?.status === 401) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 500 });
    } else if (axiosError.response?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
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

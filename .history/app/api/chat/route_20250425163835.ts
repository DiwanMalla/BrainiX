// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

interface ChatRequestBody {
  message: string;
}

interface ChatResponse {
  reply: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { error: string }>
) {
  // Validate request method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate request body
  const { message } = req.body as ChatRequestBody;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Invalid or missing message" });
  }

  // Validate API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Changed to a more accessible model; use 'gpt-4o' if you have access
        messages: [
          {
            role: "system",
            content: "You are a helpful tutor for an e-learning platform.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 150, // Limit response length for efficiency
        temperature: 0.7, // Adjust for balanced responses
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

    res.status(200).json({ reply });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorDetails = axiosError.response?.data || axiosError.message;
    console.error("Error calling OpenAI API:", errorDetails);

    // Provide specific error messages based on status codes
    if (axiosError.response?.status === 401) {
      res.status(500).json({ error: "Invalid API key" });
    } else if (axiosError.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Try again later." });
    } else {
      res
        .status(500)
        .json({ error: "Failed to process request. Please try again." });
    }
  }
}

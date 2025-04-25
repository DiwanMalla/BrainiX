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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body as ChatRequestBody;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content as string;
    res.status(200).json({ reply });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error calling OpenAI API:",
      axiosError.response?.data || axiosError.message
    );
    res.status(500).json({ error: "Error processing request" });
  }
}

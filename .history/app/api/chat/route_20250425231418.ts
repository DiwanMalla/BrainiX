import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_API_TOKEN);

export async function POST(request: Request) {
  const { message } = await request.json();

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: `You are a tutor on an eLearning platform. Respond to: ${message}`,
      parameters: { max_length: 150, temperature: 0.7 },
    });
    return NextResponse.json({ reply: response.generated_text });
  } catch (error) {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

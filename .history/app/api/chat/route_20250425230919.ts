import { InferenceClient } from "huggingface_hub";

export async function POST(req) {
  const { message } = await req.json();
  const client = new InferenceClient({ token: process.env.HF_API_TOKEN });

  try {
    const response = await client.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      prompt: `You are a tutor on an eLearning platform. Respond to: ${message}`,
      max_length: 150,
      temperature: 0.7,
    });
    return new Response(JSON.stringify({ reply: response.generated_text }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
    });
  }
}

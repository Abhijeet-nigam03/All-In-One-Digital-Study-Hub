import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Add a system prompt to guide the AI's behavior
    const systemPrompt = `You are an intelligent, helpful, and highly knowledgeable study assistant for the Study-Hub platform.
Your goal is to help users learn, understand concepts deeply, and stay focused.
When users ask questions, provide detailed, long-form answers that are highly educational.
Use formatting like bolding, bullet points, and code blocks where appropriate.
If they ask for a study plan, give them a comprehensive, step-by-step schedule.
Always be encouraging and maintain a supportive tone.`;

    // Gemini requires the first message to be from the user.
    // We must strip out the initial welcome message from the array.
    const firstUserIndex = Array.isArray(messages) ? messages.findIndex((m: any) => m.role === "user") : -1;
    const validMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : (messages || []);
    
    // Convert client-side Message objects to AI SDK's CoreMessage format manually
    const coreMessages = validMessages.map((m: any) => {
      let textContent = '';
      if (typeof m.content === 'string' && m.content) {
        textContent = m.content;
      } else if (Array.isArray(m.parts)) {
        textContent = m.parts
          .filter((p: any) => p && (p.type === 'text' || typeof p.text === 'string'))
          .map((p: any) => p.text || '')
          .join('');
      } else if (typeof m.text === 'string') {
        textContent = m.text;
      }
      return {
        role: m.role as 'user' | 'assistant' | 'system',
        content: textContent.trim()
      };
    }).filter((m: any) => m.content.length > 0);

    if (coreMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No user message found to process." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      model: google("gemini-3-flash-preview"),
      messages: coreMessages,
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

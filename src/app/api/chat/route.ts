import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Add a system prompt to guide the AI's behavior
    const systemPrompt = `You are an intelligent, helpful, and highly knowledgeable study assistant for the Study-Hub platform.
Your goal is to help users learn, understand concepts deeply, and stay focused.
When users ask questions, provide detailed, long-form answers that are highly educational.
Use formatting like bolding, bullet points, and code blocks where appropriate.
If they ask for a study plan, give them a comprehensive, step-by-step schedule.
Always be encouraging and maintain a supportive tone.`;

    // Gemini requires the first message to be from the user.
    // We must strip out the initial welcome message from the array.
    const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
    const validMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;
    
    // Convert client-side Message objects to AI SDK's CoreMessage format manually
    const coreMessages = validMessages.map((m: any) => {
      let textContent = m.content;
      // If content is missing but parts are available (from UI), extract text
      if (!textContent && m.parts) {
        textContent = m.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join('');
      }
      return {
        role: m.role,
        content: textContent || ""
      };
    });

    const result = streamText({
      model: google("gemini-3.5-flash"),
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

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiMessage, Expense, Group } from "@/types";
import { nanoid } from "@/lib/nanoid";

interface Payload {
  messages: AiMessage[];
  groups: Group[];
  expenses: Expense[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = `You are an empathetic financial assistant.
- Summarise balances, highlight anomalies, and propose settlements.
- Provide actionable next steps in bullet form.
- Reference groups by name.
- If the user asks for translation, respond in that language.
- Mention when automations like Inngest or Resend should be triggered.`;

  if (!apiKey) {
    const fallback: AiMessage = {
      id: nanoid(),
      role: "assistant",
      createdAt: new Date().toISOString(),
      content:
        "Gemini is offline, but here's a quick summary: your groups have " +
        `${body.expenses.length} logged expenses. Consider running the smart settlement automation to keep balances tidy.`,
    };
    return NextResponse.json(fallback);
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const conversation = body.messages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n");

    const prompt = `${systemPrompt}

Context JSON:
Groups: ${JSON.stringify(body.groups)}
Expenses: ${JSON.stringify(body.expenses)}

Conversation so far:
${conversation}

Respond to the latest user message.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const response: AiMessage = {
      id: nanoid(),
      role: "assistant",
      content: text,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Gemini chat failed", error);
    const fallback: AiMessage = {
      id: nanoid(),
      role: "assistant",
      createdAt: new Date().toISOString(),
      content:
        "I couldn't reach Gemini right now. Try regenerating in a moment or review your latest dashboards for insights.",
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}

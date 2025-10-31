import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { type AiInsight, type Expense, type Group } from "@/types";
import { nanoid } from "@/lib/nanoid";

interface Payload {
  groups: Group[];
  expenses: Expense[];
}

function fallbackInsights({ groups, expenses }: Payload): AiInsight[] {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const topGroup = groups[0];
  return [
    {
      id: nanoid(),
      title: `${topGroup?.name ?? "Your group"} spending snapshot`,
      description: `You've tracked ${expenses.length} expenses so far totalling $${total.toFixed(
        2,
      )}. Consider enabling smart settlements to keep reimbursements simple.`,
      impact: "medium",
      createdAt: new Date().toISOString(),
      actions: [
        "Generate a mid-month report",
        "Remind members when balances exceed $50",
      ],
    },
  ];
}

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(fallbackInsights(body));
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an AI financial copilot. Using the JSON data, craft 3 concise insights with impact level (low, medium, high) and actionable steps.

Groups: ${JSON.stringify(body.groups)}
Expenses: ${JSON.stringify(body.expenses)}

Return JSON array matching the schema:
[{"title":"","description":"","impact":"low|medium|high","actions":["string"]}]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as Array<
      Omit<AiInsight, "id" | "createdAt">
    >;

    const insights: AiInsight[] = parsed.slice(0, 3).map((insight) => ({
      id: nanoid(),
      createdAt: new Date().toISOString(),
      ...insight,
    }));

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Gemini insight generation failed", error);
    return NextResponse.json(fallbackInsights(body), { status: 200 });
  }
}

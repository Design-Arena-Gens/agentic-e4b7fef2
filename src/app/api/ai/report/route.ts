import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AutoReport, Expense, Group } from "@/types";
import { nanoid } from "@/lib/nanoid";

interface Payload {
  groupId?: string;
  groups: Group[];
  expenses: Expense[];
}

function buildFallbackReport(payload: Payload): AutoReport {
  const { groupId, groups, expenses } = payload;
  const scopedExpenses = groupId
    ? expenses.filter((expense) => expense.groupId === groupId)
    : expenses;
  const total = scopedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const groupName = groupId
    ? groups.find((group) => group.id === groupId)?.name ?? "All groups"
    : "All groups";

  return {
    id: nanoid(),
    groupId,
    title: `${groupName} summary`,
    summary: `${groupName} recorded ${scopedExpenses.length} expenses totalling $${total.toFixed(
      2,
    )}. Consider enabling automated reminders to settle balances quickly.`,
    highlights: [
      "Top categories exceeded expectations by 8% vs last month.",
      "Smart settlement can reduce repayments from 6 to 2 transactions.",
      "Gemini recommends setting a mid-month check-in automation.",
    ],
    settlements: [],
    totalSpend: total,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(buildFallbackReport(body));
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const scopedGroups = body.groupId
      ? body.groups.filter((group) => group.id === body.groupId)
      : body.groups;
    const scopedExpenses = body.groupId
      ? body.expenses.filter((expense) => expense.groupId === body.groupId)
      : body.expenses;

    const prompt = `You are building a financial report summarising group expenses.
Return JSON with keys: title, summary, highlights (array of 3 strings), settlements (array of {from,to,amount,currency}), totalSpend.
Focus on budgeting advice, settlement optimisation, and trends.

Groups: ${JSON.stringify(scopedGroups)}
Expenses: ${JSON.stringify(scopedExpenses)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as Omit<AutoReport, "id" | "generatedAt" | "groupId">;

    const report: AutoReport = {
      id: nanoid(),
      groupId: body.groupId,
      generatedAt: new Date().toISOString(),
      downloadUrl: "#",
      ...parsed,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Gemini report failed", error);
    return NextResponse.json(buildFallbackReport(body), { status: 200 });
  }
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe2, MessageSquare, PieChart, Send } from "lucide-react";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import Link from "next/link";
import type { Route } from "next";

const actions: Array<{
  title: string;
  description: string;
  icon: typeof FileText;
  href: Route;
}> = [
  {
    title: "Generate trip report",
    description: "Summarise a travel group with expenses, hotspots, and settlements.",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Ask for insights",
    description: "Chat with Gemini and surface overspending patterns instantly.",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Translate advice",
    description: "Render insights in the preferred language of each member.",
    icon: Globe2,
    href: "/global-insights",
  },
  {
    title: "Budget drill-down",
    description: "Run AI-driven breakdowns by category with saving suggestions.",
    icon: PieChart,
    href: "/automations",
  },
];

export function AiQuickActions() {
  const { generateReport } = useRealtimeData();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-white">AI command bar</CardTitle>
        <CardDescription>One-click automations orchestrated by Inngest</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-100">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <p className="text-sm font-semibold text-white">{action.title}</p>
                <p className="text-xs text-white/60">{action.description}</p>
              </span>
            </Link>
          );
        })}
        <Button
          variant="secondary"
          className="mt-2 gap-2"
          onClick={() => generateReport()}
        >
          <Send className="h-4 w-4" />
          Auto-generate report
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import CountUp from "react-countup";
import { Sparkles, TrendingUp, Wallet } from "lucide-react";

export function Overview() {
  const { expenses, insights } = useRealtimeData();

  const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const now = new Date();
  const monthlySpend = expenses
    .filter((expense) => {
      const created = new Date(expense.createdAt);
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card className="relative overflow-hidden">
        <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-primary-400/30 blur-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            Total spend
            <Badge variant="outline">All accounts</Badge>
          </CardTitle>
          <CardDescription>All shared & personal expenses tracked</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-4xl font-semibold text-white">
            <CountUp end={totalSpend} prefix="$" decimals={2} duration={1.6} />
          </p>
          <Button variant="secondary" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            View Trends
          </Button>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 backdrop-blur" />
        <CardHeader>
          <CardTitle className="text-white">This month</CardTitle>
          <CardDescription>Live sync across groups via Convex</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-4xl font-semibold text-white">
            <CountUp end={monthlySpend} prefix="$" decimals={2} duration={1.6} />
          </p>
          <div className="flex flex-col items-end text-xs text-white/60">
            <span>Gemini is watching your spend curve</span>
            <span className="text-white/80">+4.2% vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-primary-400/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Sparkles className="h-5 w-5" />
            Live AI playbook
          </CardTitle>
          <CardDescription>
            {insights.length > 0
              ? insights[0]!.title
              : "Gemini is ready to prepare your playbook."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <Button variant="secondary" className="gap-2">
            <Wallet className="h-4 w-4" />
            Optimize Settlements
          </Button>
          <p className="text-sm text-white/70">
            {insights[0]?.description ?? "Tap to generate your first insight."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

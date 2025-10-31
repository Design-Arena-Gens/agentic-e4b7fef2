"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/format";

export function SpendingAnalytics() {
  const { expenses } = useRealtimeData();

  const chartData = useMemo(() => {
    const monthlyMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + expense.amount);
    });

    return Array.from(monthlyMap.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]) => ({ month: key, amount: Number(value.toFixed(2)) }));
  }, [expenses]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Spend velocity</CardTitle>
          <CardDescription>Gemini models your month-over-month spend</CardDescription>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
          +8.4% growth
        </span>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              cursor={{ strokeDasharray: "4 2" }}
              contentStyle={{
                background: "rgba(17, 25, 40, 0.85)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area type="monotone" dataKey="amount" stroke="#60A5FA" fill="url(#colorSpend)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

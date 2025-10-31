"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { useBudgetAutomation } from "@/providers/budget-automation-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { BellRing } from "lucide-react";

export function BudgetAlerts() {
  const { budgetAlerts } = useRealtimeData();
  const { triggerBudgetScan, isProcessing } = useBudgetAutomation();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Budget radar</CardTitle>
          <CardDescription>Inngest orchestrates alerts & Resend notifies stakeholders</CardDescription>
        </div>
        <Button variant="secondary" size="sm" className="gap-2" onClick={triggerBudgetScan} disabled={isProcessing}>
          <BellRing className="h-4 w-4" /> Scan now
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {budgetAlerts.map((alert) => (
          <div key={alert.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white/90">{alert.message}</p>
              <Badge variant={alert.severity === "critical" ? "destructive" : alert.severity === "warning" ? "warning" : "outline"}>
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>Projected overspend: {formatCurrency(alert.projectedOverspend)}</span>
              <span>{formatDate(alert.createdAt)}</span>
            </div>
          </div>
        ))}
        {budgetAlerts.length === 0 && (
          <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
            Gemini has not detected any anomalies. We will alert you as you approach your budget.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

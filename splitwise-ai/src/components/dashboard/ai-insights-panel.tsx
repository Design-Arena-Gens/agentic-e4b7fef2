"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const impactStyles: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-200",
  medium: "bg-amber-500/15 text-amber-200",
  high: "bg-rose-500/20 text-rose-200",
};

export function AiInsightsPanel() {
  const { insights, refreshAiInsights, isLoading } = useRealtimeData();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Gemini insights</CardTitle>
          <CardDescription>Adaptive recommendations generated from spend graphs</CardDescription>
        </div>
        <Button variant="secondary" size="sm" className="gap-2" onClick={refreshAiInsights} disabled={isLoading}>
          <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
              <Badge className={impactStyles[insight.impact] ?? impactStyles.low}>
                {insight.impact.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-white/70">{insight.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
              {insight.actions.map((action, index) => (
                <span key={`${insight.id}-action-${index}`} className="rounded-full border border-white/10 px-3 py-1">
                  {action}
                </span>
              ))}
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-white/60">
            <Sparkles className="h-6 w-6" />
            <p>Ask Gemini to analyse your data and surface proactive insights.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

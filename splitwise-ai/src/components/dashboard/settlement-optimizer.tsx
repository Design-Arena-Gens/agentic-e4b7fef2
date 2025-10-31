"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { formatCurrency } from "@/lib/format";
import { ArrowRightLeft, Send } from "lucide-react";

export function SettlementOptimizer() {
  const { settlements, optimizeSettlements } = useRealtimeData();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Smart settlements</CardTitle>
          <CardDescription>Gemini minimises payments across all groups</CardDescription>
        </div>
        <Button variant="secondary" size="sm" className="gap-2" onClick={optimizeSettlements}>
          <ArrowRightLeft className="h-4 w-4" />
          Optimise
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {settlements.length === 0 && (
          <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/60">
            No active debts. Gemini will propose settlements once expenses sync in.
          </p>
        )}
        {settlements.map((settlement, index) => (
          <div
            key={`${settlement.from}-${settlement.to}-${index}`}
            className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-col text-sm text-white/80">
              <span className="font-semibold text-white">{settlement.from} &rarr; {settlement.to}</span>
              <span className="text-xs text-white/60">{settlement.currency}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{formatCurrency(settlement.amount, settlement.currency)}</Badge>
              <Button size="sm" variant="secondary" className="gap-2">
                <Send className="h-4 w-4" /> Pay now
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

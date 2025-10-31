"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { FileDown, Loader2, Share2 } from "lucide-react";

export default function ReportsPage() {
  const { groups, reports, generateReport, isLoading } = useRealtimeData();
  const [groupId, setGroupId] = useState<string | undefined>(groups[0]?.id);

  const handleGenerate = () => {
    generateReport(groupId === "all" ? undefined : groupId);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Auto report generator</CardTitle>
            <CardDescription>Gemini compiles charts, insights, and settlements into a polished PDF.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-white/60">Scope</label>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All groups</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="gap-2" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                Generate report
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-white/10 to-transparent" />
              <CardHeader>
                <CardTitle className="text-white">{report.title}</CardTitle>
                <CardDescription>{report.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-white/70">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{formatCurrency(report.totalSpend)}</Badge>
                  <span>{report.highlights.length} highlights</span>
                  <span>{report.settlements.length} settlements</span>
                  <span>Generated {formatDate(report.generatedAt)}</span>
                </div>
                <ul className="grid gap-2 text-white/80">
                  {report.highlights.map((highlight, index) => (
                    <li key={`${report.id}-highlight-${index}`}>• {highlight}</li>
                  ))}
                </ul>
                <div className="grid gap-2 text-xs text-white/60">
                  {report.settlements.map((settlement, index) => (
                    <p key={`${report.id}-settlement-${index}`}>
                      {settlement.from} pays {settlement.to} {formatCurrency(settlement.amount, settlement.currency)}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="secondary" className="gap-2">
                    <a href={report.downloadUrl ?? "#"}>
                      <FileDown className="h-4 w-4" /> Download PDF
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" /> Share with group
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Automated delivery</CardTitle>
            <CardDescription>Reports are emailed via Resend and archived to storage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>• Monthly summary: Sent to each group owner with key highlights.</p>
            <p>• Trip reports: Delivered 24 hours after trip end with settlement steps.</p>
            <p>• Budget retros: Personalised insights in preferred language.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

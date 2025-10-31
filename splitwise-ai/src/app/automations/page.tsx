import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock4, Disc3, MailCheck, RefreshCcw } from "lucide-react";

const automations = [
  {
    id: "settlement-optimizer",
    name: "Smart Settlement Optimizer",
    schedule: "Hourly",
    description: "Clusters debts across groups and proposes the minimum set of payments.",
    status: "Active",
  },
  {
    id: "budget-alerts",
    name: "Budget Alert Pipeline",
    schedule: "10 min",
    description: "Inngest triggers Gemini to evaluate budgets and sends Resend email nudges.",
    status: "Active",
  },
  {
    id: "monthly-report",
    name: "Monthly AI Report",
    schedule: "Every month",
    description: "Generates PDF summaries with charts and insights for each group.",
    status: "Queued",
  },
];

export default function AutomationsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Inngest orchestration</CardTitle>
            <CardDescription>Event-driven automations across Gemini + Resend.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{automation.name}</p>
                  <p className="text-xs text-white/60">{automation.description}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock4 className="h-4 w-4" /> {automation.schedule}
                  </span>
                  <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                    {automation.status}
                  </Badge>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <RefreshCcw className="h-4 w-4" /> Run now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Delivery channels</CardTitle>
            <CardDescription>Resend handles notifications and receipts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2"><Disc3 className="h-4 w-4" /> Slack Digests: Quick group pulse at 9 AM daily.</p>
            <p className="flex items-center gap-2"><MailCheck className="h-4 w-4" /> Email Nudges: Budget warnings translated per language preferences.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

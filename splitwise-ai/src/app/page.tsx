import { AppShell } from "@/components/layout/app-shell";
import { Overview } from "@/components/dashboard/overview";
import { SpendingAnalytics } from "@/components/dashboard/spending-analytics";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { SettlementOptimizer } from "@/components/dashboard/settlement-optimizer";
import { BudgetAlerts } from "@/components/dashboard/budget-alerts";
import { VoiceExpense } from "@/components/dashboard/voice-expense";
import { ReceiptScanner } from "@/components/dashboard/receipt-scanner";
import { AiQuickActions } from "@/components/dashboard/ai-quick-actions";

export default function Page() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Overview />
        <SpendingAnalytics />
        <div className="grid gap-4 md:grid-cols-2">
          <VoiceExpense />
          <ReceiptScanner />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <AiInsightsPanel />
        <SettlementOptimizer />
        <BudgetAlerts />
        <AiQuickActions />
      </div>
    </AppShell>
  );
}

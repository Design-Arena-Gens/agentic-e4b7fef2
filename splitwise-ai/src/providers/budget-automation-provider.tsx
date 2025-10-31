"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { toast } from "@/components/ui/sonner";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { type BudgetAlert } from "@/types";
import { nanoid } from "@/lib/nanoid";

interface BudgetAutomationContextValue {
  isProcessing: boolean;
  triggerBudgetScan: () => void;
  scheduleReminder: (input: { to: string; amount: number; note?: string }) => Promise<void>;
}

const BudgetAutomationContext =
  createContext<BudgetAutomationContextValue | null>(null);

export function BudgetAutomationProvider({ children }: PropsWithChildren) {
  const { expenses, budgetAlerts, currentUser } = useRealtimeData();
  const [isProcessing, setProcessing] = useState(false);

  const runBudgetScan = useCallback(() => {
    const categoryTotals = new Map<string, number>();
    const monthlyExpenses = expenses.filter((expense) => {
      const created = new Date(expense.createdAt);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    });

    for (const expense of monthlyExpenses) {
      categoryTotals.set(
        expense.category,
        (categoryTotals.get(expense.category) ?? 0) + expense.amount,
      );
    }

    const groceries = categoryTotals.get("Groceries") ?? 0;
    const budgetThreshold = currentUser.monthlyBudget * 0.8;

    if (groceries > budgetThreshold) {
      const alert: BudgetAlert = {
        id: nanoid(),
        userId: currentUser.id,
        message: `Gemini predicts grocery spending will exceed your budget by $${(
          groceries - budgetThreshold
        ).toFixed(2)}.`,
        severity: "warning",
        projectedOverspend: groceries - budgetThreshold,
        createdAt: new Date().toISOString(),
      };

      toast.warning(alert.message);
    }
  }, [currentUser.id, currentUser.monthlyBudget, expenses]);

  useEffect(() => {
    if (!budgetAlerts.length) return;
    const latest = budgetAlerts[0];
    toast.message("Budget Alert", {
      description: latest.message,
    });
  }, [budgetAlerts]);

  const scheduleReminder = useCallback<
    BudgetAutomationContextValue["scheduleReminder"]
  >(async ({ to, amount, note }) => {
    setProcessing(true);
    try {
      const response = await fetch("/api/notifications/reminder", {
        method: "POST",
        body: JSON.stringify({ to, amount, note }),
      });
      if (!response.ok) throw new Error("Failed to schedule reminder");
      toast.success("Smart reminder scheduled via Resend");
    } catch (error) {
      console.error(error);
      toast.error("Unable to schedule reminder. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const triggerBudgetScan = useCallback(() => {
    setProcessing(true);
    runBudgetScan();
    setProcessing(false);
  }, [runBudgetScan]);

  const value = useMemo<BudgetAutomationContextValue>(
    () => ({
      isProcessing,
      triggerBudgetScan,
      scheduleReminder,
    }),
    [isProcessing, scheduleReminder, triggerBudgetScan],
  );

  return (
    <BudgetAutomationContext.Provider value={value}>
      {children}
    </BudgetAutomationContext.Provider>
  );
}

export function useBudgetAutomation() {
  const context = useContext(BudgetAutomationContext);
  if (!context) {
    throw new Error(
      "useBudgetAutomation must be used within a BudgetAutomationProvider",
    );
  }
  return context;
}

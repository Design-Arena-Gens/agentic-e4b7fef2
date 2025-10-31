"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { RealtimeDataProvider } from "@/providers/realtime-data-provider";
import { BudgetAutomationProvider } from "@/providers/budget-automation-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RealtimeDataProvider>
        <BudgetAutomationProvider>
          {children}
          <Toaster richColors position="top-right" />
        </BudgetAutomationProvider>
      </RealtimeDataProvider>
    </ThemeProvider>
  );
}

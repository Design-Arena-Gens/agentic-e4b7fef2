"use client";

import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen items-stretch gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-white antialiased md:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute left-1/3 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary-500/30 blur-[160px]" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-[540px] w-[360px] translate-x-1/3 rounded-full bg-purple-500/20 blur-[180px]" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-[360px] w-[360px] -translate-x-1/3 rounded-full bg-emerald-500/10 blur-[190px]" />
      </div>
      <Sidebar />
      <main className={cn("flex flex-1 flex-col gap-6")}
      >
        <TopNav />
        <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          {children}
        </div>
      </main>
    </div>
  );
}

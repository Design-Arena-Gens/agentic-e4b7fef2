"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bot,
  CreditCard,
  Globe,
  Home,
  Layers,
  Settings,
  Users,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import type { Route } from "next";

const routes: Array<{ href: Route; label: string; icon: typeof Home }> = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/chat", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/automations", label: "Automations", icon: Wand2 },
  { href: "/global-insights", label: "Insights", icon: Globe },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] flex-col justify-between rounded-4xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl lg:flex">
      <div className="flex flex-col gap-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-inner">
            <Image
              src="/logo.svg"
              alt="Splitwise AI"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-white/60">
              Splitwise AI
            </p>
            <p className="text-lg font-semibold text-white">
              Glass Ledger
            </p>
          </div>
        </Link>

        <nav className="grid gap-1">
          {routes.map((route) => {
            const Icon = route.icon;
            const active = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white",
                  active && "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg",
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500/20 via-primary-400/10 to-primary-300/20 p-5 shadow-inner text-white">
        <div className="flex items-center gap-3">
          <Layers className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Gemini Automations</p>
            <p className="text-xs text-white/70">
              Seamlessly orchestrated by Inngest &amp; Resend.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

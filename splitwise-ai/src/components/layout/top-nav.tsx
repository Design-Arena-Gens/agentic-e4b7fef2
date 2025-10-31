"use client";

import Link from "next/link";
import { Command, Sparkles, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopNav() {
  const { currentUser, settlements } = useRealtimeData();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useHotkeys("meta+k,ctrl+k", (event) => {
    event.preventDefault();
    router.push("/chat?focus=true");
  });

  const outstanding = settlements.length;

  return (
    <header className="flex items-center justify-between gap-4 rounded-4xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-2xl">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden flex-1 items-center lg:flex">
          <Command className="pointer-events-none absolute left-4 h-4 w-4 text-white/50" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search expenses, groups, or ask Gemini..."
            className="pl-12 pr-36"
          />
          <Badge className="absolute right-3 hidden lg:flex" variant="outline">
            ⌘K Quick Actions
          </Badge>
        </div>
        <Button
          variant="secondary"
          className="lg:hidden"
          onClick={() => router.push("/chat")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Ask Gemini
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden flex-col text-right text-xs text-white/60 sm:flex">
          <span>Outstanding settlements</span>
          <span className="text-sm font-semibold text-white">
            {outstanding} active
          </span>
        </div>
        <Button variant="ghost" className="hidden items-center gap-2 md:flex">
          <Wallet className="h-4 w-4" />
          Smart settle
        </Button>
        <ThemeToggle />
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-3 py-2 transition hover:bg-white/20"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-sm text-white/80 sm:block">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-white/60">{currentUser.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

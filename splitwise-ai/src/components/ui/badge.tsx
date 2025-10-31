"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning" | "destructive";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-white/15 text-white",
  outline: "border border-white/20 text-white/80",
  success: "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30",
  warning: "bg-amber-500/20 text-amber-200 border border-amber-300/30",
  destructive: "bg-rose-500/20 text-rose-200 border border-rose-300/30",
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

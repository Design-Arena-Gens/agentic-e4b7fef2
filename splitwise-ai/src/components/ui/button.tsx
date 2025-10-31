"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "secondary" | "ghost" | "outline" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-gradient-to-r from-primary-500/90 to-primary-400/90 text-white shadow-md hover:from-primary-500 hover:to-primary-400",
  secondary:
    "bg-white/10 text-foreground shadow-inner backdrop-blur hover:bg-white/20 border border-white/20",
  ghost:
    "bg-transparent text-foreground hover:bg-white/10 hover:text-foreground",
  outline:
    "border border-white/30 text-foreground bg-transparent hover:bg-white/10",
  link: "text-primary-400 underline-offset-4 hover:underline",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

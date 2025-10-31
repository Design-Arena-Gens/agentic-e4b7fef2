"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-foreground backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 placeholder:text-white/50 dark:border-white/5",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

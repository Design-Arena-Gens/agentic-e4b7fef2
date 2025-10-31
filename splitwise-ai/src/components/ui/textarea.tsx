"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-foreground backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 placeholder:text-white/50 dark:border-white/5",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

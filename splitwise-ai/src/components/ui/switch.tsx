"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/15 p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 data-[state=checked]:bg-primary-400/80",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";
  const iconKey = isDark ? "moon" : "sun";

  return (
    <Button
      variant="secondary"
      size="icon"
      className="relative h-11 w-11 overflow-hidden"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={iconKey}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

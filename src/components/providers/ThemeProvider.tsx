"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(isDark: boolean) {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    if (theme === "dark") {
      applyTheme(true);
      return;
    }

    if (theme === "light") {
      applyTheme(false);
      return;
    }

    // "auto" — follow system preference
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      applyTheme(e.matches);
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return <>{children}</>;
}

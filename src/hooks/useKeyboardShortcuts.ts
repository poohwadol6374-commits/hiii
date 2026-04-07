"use client";

import { useEffect, useCallback, useState } from "react";

export interface ShortcutDef {
  key: string;
  label: string;
  description: string;
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutDef[];
  enabled?: boolean;
}

/**
 * Custom hook for global keyboard shortcuts.
 * Shortcuts are disabled when an input/textarea/select is focused.
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleHelp = useCallback(() => {
    setHelpOpen((prev) => !prev);
  }, []);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      // Escape always closes help
      if (e.key === "Escape") {
        if (helpOpen) {
          e.preventDefault();
          closeHelp();
          return;
        }
      }

      // ? key toggles help
      if (e.key === "?") {
        e.preventDefault();
        toggleHelp();
        return;
      }

      // Don't process shortcuts when help is open (except Escape and ?)
      if (helpOpen) return;

      // Match shortcut
      const match = shortcuts.find((s) => {
        if (s.key === "ArrowLeft" && e.key === "ArrowLeft") return true;
        if (s.key === "ArrowRight" && e.key === "ArrowRight") return true;
        return s.key.toLowerCase() === e.key.toLowerCase();
      });

      if (match) {
        e.preventDefault();
        match.action();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, shortcuts, helpOpen, toggleHelp, closeHelp]);

  return { helpOpen, closeHelp };
}

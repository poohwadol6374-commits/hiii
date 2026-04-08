"use client";

import TopBar from "@/components/app/TopBar";
import Sidebar from "@/components/app/Sidebar";
import LumaFab from "@/components/app/LumaFab";
import BottomNav from "@/components/app/BottomNav";
import PomodoroTimer from "@/components/app/PomodoroTimer";
import FocusMode from "@/components/app/FocusMode";
import CommandPalette from "@/components/app/CommandPalette";
import PageTransition from "@/components/app/PageTransition";
import { AnimatePresence } from "framer-motion";
import { ToastProvider, useToast } from "@/components/app/Toast";
import { useFocusStore } from "@/stores/focusStore";
import { useUndoStore } from "@/stores/undoStore";
import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

function UndoRedoHandler() {
  const undo = useUndoStore((s) => s.undo);
  const redo = useUndoStore((s) => s.redo);
  const canUndo = useUndoStore((s) => s.canUndo);
  const canRedo = useUndoStore((s) => s.canRedo);
  const { showToast } = useToast();

  const handler = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      if (canUndo()) {
        const action = undo();
        if (action) showToast(`Undo: ${action.label}`, "info");
      }
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      if (canRedo()) {
        const action = redo();
        if (action) showToast(`Redo: ${action.label}`, "info");
      }
    }
  }, [undo, redo, canUndo, canRedo, showToast]);

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const focusActive = useFocusStore((s) => s.active);
  const stopFocus = useFocusStore((s) => s.stopFocus);
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  // Esc to exit focus mode
  useEffect(() => {
    if (!focusActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopFocus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusActive, stopFocus]);

  // Onboarding = fullscreen, no chrome
  if (isOnboarding) {
    return (
      <ToastProvider>
        <div className="h-screen overflow-y-auto bg-white dark:bg-lumina-950">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-lumina-950">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <AnimatePresence mode="wait">
              <PageTransition>
                {children}
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
        <BottomNav />
      </div>
      <LumaFab />
      <PomodoroTimer />
      <FocusMode />
      <CommandPalette />
      <UndoRedoHandler />
    </ToastProvider>
  );
}

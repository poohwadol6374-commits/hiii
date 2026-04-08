"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface ShortcutEntry {
  key: string;
  label: string;
  description: string;
}

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
  shortcuts: ShortcutEntry[];
}

const keyDisplayMap: Record<string, string> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  Escape: "Esc",
};

export default function ShortcutsHelp({ open, onClose, shortcuts }: ShortcutsHelpProps) {
  const t = useTranslations("CalendarPage");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white/95 dark:bg-lumina-900/95 backdrop-blur-xl rounded-3xl border border-lumina-200/60 dark:border-lumina-800 w-full max-w-md overflow-hidden"
              style={{ boxShadow: "var(--shadow-modal)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-lumina-900 dark:text-lumina-100">
                    {t("shortcutsTitle")}
                  </h2>
                  <p className="text-xs text-lumina-400 mt-0.5">
                    {t("shortcutsDesc")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-lumina-400 hover:text-lumina-700 hover:bg-lumina-100 transition-colors"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-6 pb-6 space-y-1.5 max-h-[60vh] overflow-y-auto">
                {shortcuts.map((shortcut, i) => {
                  const displayKey =
                    keyDisplayMap[shortcut.key] ?? shortcut.key.toUpperCase();
                  return (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-lumina-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-lumina-100 border border-lumina-200 text-xs font-semibold text-lumina-700 font-mono">
                          {displayKey}
                        </kbd>
                        <span className="text-sm text-lumina-700">
                          {shortcut.description}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Help shortcut (always shown) */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shortcuts.length * 0.02 }}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-lumina-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-lumina-100 border border-lumina-200 text-xs font-semibold text-lumina-700 font-mono">
                      ?
                    </kbd>
                    <span className="text-sm text-lumina-700">
                      {t("shortcutsToggle")}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (shortcuts.length + 1) * 0.02 }}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-lumina-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-lumina-100 border border-lumina-200 text-xs font-semibold text-lumina-700 font-mono">
                      Esc
                    </kbd>
                    <span className="text-sm text-lumina-700">
                      {t("shortcutsClose")}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-lumina-100 bg-lumina-50/50">
                <p className="text-[11px] text-lumina-400 text-center">
                  {t("pressToClose", { key: "Esc" })}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastItem {
  id: number;
  message: string;
  type?: "info" | "success" | "warning";
}

interface ToastContextValue {
  showToast: (message: string, type?: "info" | "success" | "warning") => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: "info" | "success" | "warning" = "info") => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastBubble key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
    </svg>
  ),
};

const colorMap = {
  info: "text-google-blue-600 bg-google-blue-50 border-google-blue-200",
  success: "text-google-green-600 bg-google-green-50 border-google-green-200",
  warning: "text-google-yellow-700 bg-google-yellow-50 border-google-yellow-200",
};

function ToastBubble({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const type = toast.type ?? "info";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl border backdrop-blur-xl text-sm font-medium ${colorMap[type]}`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <span className="flex-shrink-0">{iconMap[type]}</span>
      {toast.message}
    </motion.div>
  );
}

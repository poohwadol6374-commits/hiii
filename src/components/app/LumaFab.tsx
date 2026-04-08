"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTaskStore } from "@/stores/taskStore";
import { generateResponse, type LumaChatResponse } from "@/lib/ai/lumaChat";

interface ChatMessage {
  id: string;
  role: "user" | "luma";
  text: string;
  quickActions?: string[];
}

const SIZE = 44;

export default function LumaFab() {
  const t = useTranslations("App.rightPanel");
  const tLuma = useTranslations("Luma");
  const tasks = useTaskStore((s) => s.tasks);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const didDrag = useRef(false);
  const start = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Init position
  useEffect(() => {
    setPos({ x: window.innerWidth - SIZE - 16, y: window.innerHeight - SIZE - 100 });
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Add initial greeting when panel opens
  useEffect(() => {
    if (open && messages.length === 0) {
      const pending = tasks.filter((t) => t.status !== "completed").length;
      setMessages([
        {
          id: "greeting",
          role: "luma",
          text: tLuma("greeting"),
          quickActions: [tLuma("organizeToday"), tLuma("mostImportant"), tLuma("summarizeToday")],
        },
      ]);
    }
  }, [open, messages.length, tasks, tLuma]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `u_${Date.now()}`,
        role: "user",
        text: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate typing delay for responsiveness
      setTimeout(() => {
        const response: LumaChatResponse = generateResponse(text, tasks);
        const lumaMsg: ChatMessage = {
          id: `l_${Date.now()}`,
          role: "luma",
          text: response.text,
          quickActions: response.quickActions,
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, lumaMsg]);
      }, 600 + Math.random() * 400);
    },
    [tasks],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // --- Drag logic ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      didDrag.current = false;
      start.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - start.current.mx;
        const dy = ev.clientY - start.current.my;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          didDrag.current = true;
          setIsDragging(true);
        }
        if (!didDrag.current) return;
        setPos({
          x: Math.max(4, Math.min(start.current.px + dx, window.innerWidth - SIZE - 4)),
          y: Math.max(4, Math.min(start.current.py + dy, window.innerHeight - SIZE - 4)),
        });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setIsDragging(false);
        setPos((prev) => ({
          x: prev.x + SIZE / 2 < window.innerWidth / 2 ? 12 : window.innerWidth - SIZE - 12,
          y: prev.y,
        }));
        if (!didDrag.current) setOpen(true);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos],
  );

  if (pos.x < 0) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.div
          className="fixed z-[999]"
          animate={{ left: pos.x, top: pos.y, scale: isDragging ? 1.12 : 1 }}
          transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 32 }}
          style={{ width: SIZE, height: SIZE }}
        >
          <motion.div
            className="absolute rounded-full bg-gradient-to-br from-google-blue-300/40 to-google-blue-500/20"
            style={{ inset: -6 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            onMouseDown={handleMouseDown}
            className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(66,133,244,0.85), rgba(30,100,220,0.95))",
              backdropFilter: "blur(8px)",
              boxShadow: isDragging
                ? "0 8px 28px rgba(66,133,244,0.5), 0 0 0 3px rgba(66,133,244,0.2)"
                : "0 3px 14px rgba(66,133,244,0.3), 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/25 to-transparent pointer-events-none" />
            <span className="relative text-white font-bold text-sm select-none">L</span>
            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 rounded-full bg-google-green-400 border-[1.5px] border-white" />
          </div>
        </motion.div>
      )}

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/12 backdrop-blur-[2px] z-[998]"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-[999] w-[320px] flex flex-col bg-white/95 dark:bg-lumina-900/95 backdrop-blur-xl border-l border-lumina-200/60 dark:border-lumina-800/60"
              style={{ boxShadow: "-4px 0 32px rgba(0,0,0,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-lumina-100 dark:border-lumina-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">L</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-google-green-400 border-[1.5px] border-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lumina-900 dark:text-lumina-100">{t("lumaAssistant")}</p>
                    <p className="text-[10px] text-google-green-600">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-lumina-400 hover:text-lumina-700 dark:hover:text-lumina-200 hover:bg-lumina-100 dark:hover:bg-lumina-800 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-google-blue-500 text-white"
                          : "bg-google-blue-50/60 dark:bg-lumina-800 text-lumina-700 dark:text-lumina-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      {/* Quick actions */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.quickActions.map((action) => (
                            <motion.button
                              key={action}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => sendMessage(action)}
                              className="px-2.5 py-1 text-[11px] font-medium bg-white/80 text-google-blue-600 rounded-lg border border-google-blue-200 hover:bg-white transition-colors"
                            >
                              {action}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex justify-start"
                    >
                      <div className="bg-google-blue-50/60 rounded-2xl px-4 py-3 flex items-center gap-1">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-google-blue-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-google-blue-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-google-blue-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-lumina-100 dark:border-lumina-800">
                <div className="flex items-center gap-2 bg-lumina-50 dark:bg-lumina-800 rounded-xl px-3 py-2.5">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("chatPlaceholder")}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-lumina-400 text-lumina-900 dark:text-lumina-100"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="p-1 text-google-blue-500 hover:text-google-blue-600 disabled:opacity-40 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M12 2L6 8M12 2L8.5 12L6 8M12 2L2 5.5L6 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

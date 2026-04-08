"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  useSettingsStore,
  type Theme,
  type AnimationLevel,
  type CalendarView,
  type LumaPersonality,
  type AIAggressiveness,
  type AppLocale,
} from "@/stores/settingsStore";

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const s = useSettingsStore();

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-lumina-900 dark:text-lumina-100">{t("title")}</h1>
        <p className="text-sm text-lumina-500 dark:text-lumina-400 mt-1">{t("subtitle")}</p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* ── Profile ── */}
        <Section index={0} title={t("profile")} icon="👤">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {s.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <input
                value={s.displayName}
                onChange={(e) => s.setDisplayName(e.target.value)}
                className="w-full text-sm font-medium text-lumina-900 dark:text-lumina-100 bg-lumina-100/80 dark:bg-lumina-800/80 rounded-xl px-3 py-2 border-none outline-none focus:ring-2 focus:ring-google-blue-200 focus:bg-white dark:focus:bg-lumina-800 transition-all"
                placeholder={t("displayName")}
              />
              <p className="text-xs text-lumina-400 dark:text-lumina-500 mt-1.5 px-1">{s.email}</p>
            </div>
          </div>
        </Section>

        {/* ── Appearance ── */}
        <Section index={1} title={t("appearance")} icon="🎨">
          <Label>{t("theme")}</Label>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {(["light", "dark", "auto"] as const).map((v) => (
              <OptionCard
                key={v}
                selected={s.theme === v}
                onClick={() => s.setTheme(v as Theme)}
                icon={v === "light" ? "☀️" : v === "dark" ? "🌙" : "🔄"}
                label={t(`theme_${v}`)}
              />
            ))}
          </div>
          <Label>{t("animationLevel")}</Label>
          <div className="grid grid-cols-3 gap-3">
            {(["full", "reduced", "none"] as const).map((v) => (
              <OptionCard
                key={v}
                selected={s.animationLevel === v}
                onClick={() => s.setAnimationLevel(v as AnimationLevel)}
                icon={v === "full" ? "✨" : v === "reduced" ? "💫" : "⏹️"}
                label={t(`anim_${v}`)}
              />
            ))}
          </div>
        </Section>

        {/* ── Calendar ── */}
        <Section index={2} title={t("calendar")} icon="📅">
          <Label>{t("defaultView")}</Label>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {(["day", "week", "month"] as const).map((v) => (
              <OptionCard
                key={v}
                selected={s.defaultCalendarView === v}
                onClick={() => s.setDefaultCalendarView(v as CalendarView)}
                icon={v === "day" ? "📅" : v === "week" ? "📆" : "🗓️"}
                label={t(`view_${v}`)}
              />
            ))}
          </div>
          <Label>{t("workingHours")}</Label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={s.workingHoursStart}
              onChange={(e) => s.setWorkingHoursStart(e.target.value)}
              className="rounded-xl border border-lumina-300 dark:border-lumina-700 bg-white dark:bg-lumina-800 px-3 py-2.5 text-sm text-lumina-900 dark:text-lumina-100 focus:border-google-blue-400 focus:outline-none focus:ring-2 focus:ring-google-blue-100"
            >
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <select
              value={s.workingHoursEnd}
              onChange={(e) => s.setWorkingHoursEnd(e.target.value)}
              className="rounded-xl border border-lumina-300 dark:border-lumina-700 bg-white dark:bg-lumina-800 px-3 py-2.5 text-sm text-lumina-900 dark:text-lumina-100 focus:border-google-blue-400 focus:outline-none focus:ring-2 focus:ring-google-blue-100"
            >
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </Section>

        {/* ── Luma AI ── */}
        <Section index={3} title={t("lumaAI")} icon="🤖">
          <Label>{t("personality")}</Label>
          <div className="flex flex-col gap-2 mb-5">
            {(["formal", "friendly", "cheerful", "motivational", "minimal"] as const).map((p) => (
              <button
                key={p}
                onClick={() => s.setLumaPersonality(p as LumaPersonality)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  s.lumaPersonality === p
                    ? "border-google-blue-500 bg-google-blue-50 dark:bg-google-blue-900/30 shadow-sm"
                    : "border-lumina-200 dark:border-lumina-700 bg-white dark:bg-lumina-800 hover:border-lumina-300 dark:hover:border-lumina-600"
                }`}
              >
                <span className="text-sm font-semibold text-lumina-900 dark:text-lumina-100">{t(`personality_${p}`)}</span>
                <span className="text-xs text-lumina-500 dark:text-lumina-400 ml-2">{t(`personality_${p}_desc`)}</span>
              </button>
            ))}
          </div>
          <Label>{t("aiAggressiveness")}</Label>
          <div className="grid grid-cols-3 gap-3">
            {(["conservative", "balanced", "proactive"] as const).map((v) => (
              <OptionCard
                key={v}
                selected={s.aiAggressiveness === v}
                onClick={() => s.setAIAggressiveness(v as AIAggressiveness)}
                icon={v === "conservative" ? "🛡️" : v === "balanced" ? "⚖️" : "🚀"}
                label={t(`ai_${v}`)}
              />
            ))}
          </div>
        </Section>

        {/* ── Language ── */}
        <Section index={4} title={t("language")} icon="🌐">
          <div className="grid grid-cols-2 gap-3">
            {(["th", "en"] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => s.setLocale(loc as AppLocale)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                  s.locale === loc
                    ? "border-google-blue-500 bg-google-blue-50 dark:bg-google-blue-900/30 shadow-sm"
                    : "border-lumina-200 dark:border-lumina-700 bg-white dark:bg-lumina-800 hover:border-lumina-300 dark:hover:border-lumina-600"
                }`}
              >
                <span className="text-2xl">{loc === "th" ? "🇹🇭" : "🇺🇸"}</span>
                <span className="text-sm font-semibold text-lumina-900 dark:text-lumina-100">
                  {loc === "th" ? "ไทย" : "English"}
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Pomodoro ── */}
        <Section index={5} title={t("pomodoro")} icon="🍅">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("workDuration")}</Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => s.setPomodoroWorkMinutes(s.pomodoroWorkMinutes - 5)}
                  className="w-8 h-8 rounded-lg bg-lumina-100 hover:bg-lumina-200 dark:bg-lumina-800 dark:hover:bg-lumina-700 text-lumina-700 dark:text-lumina-300 font-bold transition-colors flex items-center justify-center"
                >−</button>
                <span className="text-lg font-bold text-lumina-900 dark:text-lumina-100 w-12 text-center">{s.pomodoroWorkMinutes}</span>
                <button
                  onClick={() => s.setPomodoroWorkMinutes(s.pomodoroWorkMinutes + 5)}
                  className="w-8 h-8 rounded-lg bg-lumina-100 hover:bg-lumina-200 dark:bg-lumina-800 dark:hover:bg-lumina-700 text-lumina-700 dark:text-lumina-300 font-bold transition-colors flex items-center justify-center"
                >+</button>
                <span className="text-xs text-lumina-500 dark:text-lumina-400">{t("minutes")}</span>
              </div>
            </div>
            <div>
              <Label>{t("breakDuration")}</Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => s.setPomodoroBreakMinutes(s.pomodoroBreakMinutes - 1)}
                  className="w-8 h-8 rounded-lg bg-lumina-100 hover:bg-lumina-200 dark:bg-lumina-800 dark:hover:bg-lumina-700 text-lumina-700 dark:text-lumina-300 font-bold transition-colors flex items-center justify-center"
                >−</button>
                <span className="text-lg font-bold text-lumina-900 dark:text-lumina-100 w-12 text-center">{s.pomodoroBreakMinutes}</span>
                <button
                  onClick={() => s.setPomodoroBreakMinutes(s.pomodoroBreakMinutes + 1)}
                  className="w-8 h-8 rounded-lg bg-lumina-100 hover:bg-lumina-200 dark:bg-lumina-800 dark:hover:bg-lumina-700 text-lumina-700 dark:text-lumina-300 font-bold transition-colors flex items-center justify-center"
                >+</button>
                <span className="text-xs text-lumina-500 dark:text-lumina-400">{t("minutes")}</span>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ─── Shared Components ─── */

function Section({ index, title, icon, children }: { index: number; title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.section
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="rounded-2xl bg-white/80 dark:bg-lumina-900/80 backdrop-blur-sm p-5 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h2 className="text-base font-semibold text-lumina-900 dark:text-lumina-100">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-medium text-lumina-600 dark:text-lumina-400 mb-2">{children}</span>;
}

function OptionCard({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-center transition-all ${
        selected
          ? "border-google-blue-500 bg-google-blue-50 dark:bg-google-blue-900/30 shadow-sm"
          : "border-lumina-200 dark:border-lumina-700 bg-white dark:bg-lumina-800 hover:border-lumina-300 dark:hover:border-lumina-600"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium text-lumina-800 dark:text-lumina-200">{label}</span>
    </button>
  );
}

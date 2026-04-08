"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import LumaAvatar from "@/components/landing/LumaAvatar";

/* ─── Types ─────────────────────────────────────────────────── */

type Theme = "light" | "dark" | "auto";
type CalendarView = "day" | "week" | "month";
type AnimationLevel = "full" | "reduced" | "none";
type LumaPersonality =
  | "formal"
  | "friendly"
  | "cheerful"
  | "motivational"
  | "minimal";
type AppLocale = "th" | "en";

interface OnboardingState {
  workingHoursStart: string;
  workingHoursEnd: string;
  theme: Theme;
  defaultCalendarView: CalendarView;
  animationLevel: AnimationLevel;
  lumaPersonality: LumaPersonality;
  locale: AppLocale;
}

const TOTAL_STEPS = 6;

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, "0");
  return `${h}:00`;
});

/* ─── Slide variants ────────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ─── Main Component ────────────────────────────────────────── */

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);

  const [state, setState] = useState<OnboardingState>({
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    theme: "light",
    defaultCalendarView: "week",
    animationLevel: "full",
    lumaPersonality: "friendly",
    locale: "th",
  });

  const update = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSkip = async () => {
    await savePreferences();
  };

  const handleFinish = async () => {
    await savePreferences();
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // Try to save to API, but if it fails (no DB), just go to dashboard
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(() => {});

      // Set locale cookie
      document.cookie = `locale=${state.locale};path=/;max-age=${60 * 60 * 24 * 365}`;
      router.push("/dashboard");
      router.refresh();
    } catch {
      // Even if API fails, go to dashboard
      document.cookie = `locale=${state.locale};path=/;max-age=${60 * 60 * 24 * 365}`;
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-white dark:bg-lumina-950">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange-50/40 via-pink-50/20 to-purple-50/30 dark:from-purple-900/10 dark:via-transparent dark:to-transparent" />

      {/* Floating orbs with more variety */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 right-1/3 h-48 w-48 rounded-full bg-pink-200/15 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        {/* Luma Avatar with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-6 relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/20 via-pink-400/15 to-purple-400/20 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ inset: -12 }}
          />
          <LumaAvatar size={80} />
        </motion.div>

        {/* Progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-colors duration-300 ${
                i + 1 === step
                  ? "w-6 bg-google-blue-500"
                  : i + 1 < step
                    ? "w-2 bg-google-blue-300"
                    : "w-2 bg-lumina-300"
              }`}
              layout
            />
          ))}
        </div>

        {/* Step content card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className="w-full overflow-hidden rounded-3xl bg-white/90 dark:bg-lumina-900/90 backdrop-blur-xl border border-lumina-200/40 dark:border-lumina-800/40"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)" }}
        >  <div className="relative min-h-[400px] p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 1 && <StepWelcome t={t} />}
                {step === 2 && (
                  <StepWorkingHours t={t} state={state} update={update} />
                )}
                {step === 3 && (
                  <StepPreferences t={t} state={state} update={update} />
                )}
                {step === 4 && (
                  <StepPersonality t={t} state={state} update={update} />
                )}
                {step === 5 && (
                  <StepLanguage t={t} state={state} update={update} />
                )}
                {step === 6 && <StepFinish t={t} personality={state.lumaPersonality} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between border-t border-lumina-200/60 dark:border-lumina-800/60 px-8 py-4">
            <div>
              {step > 1 && step < TOTAL_STEPS && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goBack}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-lumina-600 dark:text-lumina-400 transition-colors hover:bg-lumina-100 dark:hover:bg-lumina-800"
                >
                  ← {t("back")}
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step < TOTAL_STEPS && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSkip}
                  disabled={saving}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-lumina-500 dark:text-lumina-400 transition-colors hover:bg-lumina-100 dark:hover:bg-lumina-800 disabled:opacity-50"
                >
                  {t("skip")}
                </motion.button>
              )}

              {step < TOTAL_STEPS ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(66,133,244,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goNext}
                  className="rounded-xl bg-google-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-google-blue-600"
                >
                  {t("next")} →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(66,133,244,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinish}
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-google-blue-500 to-google-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  {saving ? "..." : `🚀 ${t("startUsing")}`}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


/* ─── Step 1: Welcome ───────────────────────────────────────── */

function StepWelcome({ t }: { t: ReturnType<typeof useTranslations<"Onboarding">> }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mb-2 text-2xl font-bold text-lumina-900 dark:text-lumina-100">
        {t("step1.title")}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mb-6 text-lumina-600 dark:text-lumina-400">{t("step1.description")}</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="leading-relaxed text-lumina-700 dark:text-lumina-300">{t("step1.body")}</motion.p>
    </div>
  );
}

/* ─── Step 2: Working Hours ─────────────────────────────────── */

function StepWorkingHours({
  t,
  state,
  update,
}: {
  t: ReturnType<typeof useTranslations<"Onboarding">>;
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-2xl font-bold text-lumina-900">
        {t("step2.title")}
      </h2>
      <p className="mb-8 text-center text-lumina-600">
        {t("step2.description")}
      </p>

      <div className="flex w-full max-w-xs flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-lumina-700">
            {t("step2.startTime")}
          </span>
          <select
            value={state.workingHoursStart}
            onChange={(e) => update("workingHoursStart", e.target.value)}
            className="rounded-xl border border-lumina-300 bg-white px-4 py-3 text-lumina-900 shadow-sm transition-shadow focus:border-google-blue-400 focus:outline-none focus:ring-2 focus:ring-google-blue-100"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-lumina-700">
            {t("step2.endTime")}
          </span>
          <select
            value={state.workingHoursEnd}
            onChange={(e) => update("workingHoursEnd", e.target.value)}
            className="rounded-xl border border-lumina-300 bg-white px-4 py-3 text-lumina-900 shadow-sm transition-shadow focus:border-google-blue-400 focus:outline-none focus:ring-2 focus:ring-google-blue-100"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

/* ─── Step 3: Preferences ───────────────────────────────────── */

function StepPreferences({
  t,
  state,
  update,
}: {
  t: ReturnType<typeof useTranslations<"Onboarding">>;
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) => void;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-center text-2xl font-bold text-lumina-900">
        {t("step3.title")}
      </h2>
      <p className="mb-6 text-center text-lumina-600">
        {t("step3.description")}
      </p>

      {/* Theme */}
      <div className="mb-5">
        <span className="mb-2 block text-sm font-medium text-lumina-700">
          {t("step3.theme")}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {(["light", "dark", "auto"] as const).map((v) => (
            <OptionCard
              key={v}
              selected={state.theme === v}
              onClick={() => update("theme", v)}
              icon={v === "light" ? "☀️" : v === "dark" ? "🌙" : "🔄"}
              label={t(`step3.theme${v.charAt(0).toUpperCase() + v.slice(1)}` as `step3.themeLight`)}
            />
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <div className="mb-5">
        <span className="mb-2 block text-sm font-medium text-lumina-700">
          {t("step3.calendarView")}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {(["day", "week", "month"] as const).map((v) => (
            <OptionCard
              key={v}
              selected={state.defaultCalendarView === v}
              onClick={() => update("defaultCalendarView", v)}
              icon={v === "day" ? "📅" : v === "week" ? "📆" : "🗓️"}
              label={t(`step3.view${v.charAt(0).toUpperCase() + v.slice(1)}` as `step3.viewDay`)}
            />
          ))}
        </div>
      </div>

      {/* Animation Level */}
      <div>
        <span className="mb-2 block text-sm font-medium text-lumina-700">
          {t("step3.animationLevel")}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {(["full", "reduced", "none"] as const).map((v) => (
            <OptionCard
              key={v}
              selected={state.animationLevel === v}
              onClick={() => update("animationLevel", v)}
              icon={v === "full" ? "✨" : v === "reduced" ? "💫" : "⏹️"}
              label={t(`step3.anim${v.charAt(0).toUpperCase() + v.slice(1)}` as `step3.animFull`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Personality ───────────────────────────────────── */

function StepPersonality({
  t,
  state,
  update,
}: {
  t: ReturnType<typeof useTranslations<"Onboarding">>;
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) => void;
}) {
  const personalities: LumaPersonality[] = [
    "formal",
    "friendly",
    "cheerful",
    "motivational",
    "minimal",
  ];

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-center text-2xl font-bold text-lumina-900">
        {t("step4.title")}
      </h2>
      <p className="mb-6 text-center text-lumina-600">
        {t("step4.description")}
      </p>

      <div className="flex flex-col gap-3">
        {personalities.map((p) => (
          <button
            key={p}
            onClick={() => update("lumaPersonality", p)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              state.lumaPersonality === p
                ? "border-google-blue-500 bg-google-blue-50 shadow-sm"
                : "border-lumina-200 bg-white hover:border-lumina-300"
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-lumina-900">
                {t(`step4.${p}` as `step4.formal`)}
              </span>
              <span className="text-xs text-lumina-500">
                {t(`step4.${p}Desc` as `step4.formalDesc`)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-lumina-600 italic">
              &ldquo;{t(`step4.${p}Sample` as `step4.formalSample`)}&rdquo;
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 5: Language ──────────────────────────────────────── */

function StepLanguage({
  t,
  state,
  update,
}: {
  t: ReturnType<typeof useTranslations<"Onboarding">>;
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-2xl font-bold text-lumina-900">
        {t("step5.title")}
      </h2>
      <p className="mb-8 text-center text-lumina-600">
        {t("step5.description")}
      </p>

      <div className="grid w-full max-w-xs grid-cols-2 gap-4">
        <button
          onClick={() => update("locale", "th")}
          className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
            state.locale === "th"
              ? "border-google-blue-500 bg-google-blue-50 shadow-sm"
              : "border-lumina-200 bg-white hover:border-lumina-300"
          }`}
        >
          <span className="text-3xl">🇹🇭</span>
          <span className="text-sm font-semibold text-lumina-900">
            {t("step5.thai")}
          </span>
        </button>

        <button
          onClick={() => update("locale", "en")}
          className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
            state.locale === "en"
              ? "border-google-blue-500 bg-google-blue-50 shadow-sm"
              : "border-lumina-200 bg-white hover:border-lumina-300"
          }`}
        >
          <span className="text-3xl">🇺🇸</span>
          <span className="text-sm font-semibold text-lumina-900">
            {t("step5.english")}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ─── Step 6: Finish ────────────────────────────────────────── */

function StepFinish({
  t,
  personality,
}: {
  t: ReturnType<typeof useTranslations<"Onboarding">>;
  personality: LumaPersonality;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-4 text-5xl"
      >
        🎉
      </motion.div>
      <h2 className="mb-2 text-2xl font-bold text-lumina-900">
        {t("step6.title")}
      </h2>
      <p className="mb-6 text-lumina-600">{t("step6.description")}</p>

      <div className="w-full rounded-xl bg-google-blue-50 p-5">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-google-blue-400 to-google-blue-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">L</span>
          </div>
          <span className="text-xs font-medium text-google-blue-600">Luma</span>
        </div>
        <p className="text-sm leading-relaxed text-lumina-700 italic">
          &ldquo;{t(`step6.greeting.${personality}` as `step6.greeting.formal`)}&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ─── Shared: OptionCard ────────────────────────────────────── */

function OptionCard({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-center transition-all ${
        selected
          ? "border-google-blue-500 bg-google-blue-50 dark:bg-google-blue-900/30 shadow-md"
          : "border-lumina-200 dark:border-lumina-700 bg-white dark:bg-lumina-800 hover:border-lumina-300 dark:hover:border-lumina-600"
      }`}
    >
      <motion.span className="text-lg" animate={selected ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>{icon}</motion.span>
      <span className="text-xs font-medium text-lumina-800 dark:text-lumina-200">{label}</span>
    </motion.button>
  );
}

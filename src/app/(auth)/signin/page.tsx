"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  const doLogin = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError("");
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(t("invalidCredentials"));
        } else {
          router.push("/onboarding");
          router.refresh();
        }
      } catch {
        setError(t("genericError"));
      } finally {
        setLoading(false);
      }
    },
    [router, t]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.email) return;
    await doLogin(form.email, form.password || "demo");
  }

  async function handleGoogleDemo() {
    await doLogin("demo@lumina.app", "demo");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
      suppressHydrationWarning
    >
      <h1 className="mb-1 text-center text-2xl font-bold text-lumina-900">
        {t("signIn")}
      </h1>
      <p className="mb-8 text-center text-sm text-lumina-500">
        {t("signInDesc")}
      </p>

      {/* Google Sign-In (Demo — instant login) */}
      <button
        type="button"
        onClick={handleGoogleDemo}
        disabled={loading}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-lumina-200 bg-white px-4 py-3 text-sm font-medium text-lumina-700 shadow-[var(--shadow-soft)] transition-all hover:border-lumina-300 hover:bg-lumina-50 hover:shadow-[var(--shadow-card)] disabled:opacity-60"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {t("orContinueWith")} Google
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-lumina-200" />
        <span className="text-xs text-lumina-400">{t("or")}</span>
        <div className="h-px flex-1 bg-lumina-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-google-red-50 px-4 py-3 text-sm text-google-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-lumina-700">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-lumina-200 bg-white px-4 py-3 text-sm text-lumina-900 outline-none transition-colors placeholder:text-lumina-400 focus:border-google-blue-400 focus:ring-2 focus:ring-google-blue-100"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-lumina-700">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-lumina-200 bg-white px-4 py-3 text-sm text-lumina-900 outline-none transition-colors placeholder:text-lumina-400 focus:border-google-blue-400 focus:ring-2 focus:ring-google-blue-100"
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        <div className="flex justify-end">
          <Link href="#" className="text-xs text-google-blue-500 hover:text-google-blue-600">
            {t("forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-google-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:bg-google-blue-600 hover:shadow-[var(--shadow-card)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("loading") : t("signIn")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-lumina-500">
        {t("dontHaveAccount")}{" "}
        <Link href="/signup" className="font-medium text-google-blue-500 hover:text-google-blue-600">
          {t("signUp")}
        </Link>
      </p>
    </motion.div>
  );
}

import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "th";

const messageImports = {
  th: () => import("../../messages/th.json"),
  en: () => import("../../messages/en.json"),
} as const;

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale as Locale)
      ? (cookieLocale as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await messageImports[locale]()).default,
  };
});

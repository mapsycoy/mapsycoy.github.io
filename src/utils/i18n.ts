export const languages = ["ko", "en"] as const;

export type Language = (typeof languages)[number];

export type LocalizedText = string | Partial<Record<Language, string>>;

export const defaultLanguage: Language = "en";

export const isLanguage = (value: string | undefined): value is Language =>
  languages.includes(value as Language);

export const localize = (
  value: LocalizedText | null | undefined,
  lang: Language = defaultLanguage,
  fallback: Language = defaultLanguage
) => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value[lang] || value[fallback] || value.ko || value.en || "";
};

export const getLanguageFromParams = (value: string | undefined) =>
  isLanguage(value) ? value : defaultLanguage;

export const withLanguage = (lang: Language, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${normalizedPath}`.replace(/\/+$/g, "") || `/${lang}`;
};

export const getAlternateLanguage = (lang: Language): Language => (lang === "ko" ? "en" : "ko");

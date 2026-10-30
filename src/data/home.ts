import homeData from "./home.json";
import { defaultLanguage, localize, type Language, type LocalizedText } from "../utils/i18n";

type HomeData = {
  site?: {
    previewImage?: string;
  };
  greeting?: LocalizedText;
  caption?: LocalizedText;
};

const fallbackHomeGreeting: Record<Language, string> = {
  ko: "\uC548\uB155\uD558\uC138\uC694.",
  en: "Welcome to my space.",
};

const fallbackHomeContact = {
  email: "mapsycoy@gmail.com",
  label: { ko: "Contact", en: "Contact" } as LocalizedText,
  note: { ko: "클릭하면 주소가 복사됩니다", en: "Click to copy the address" } as LocalizedText,
  copied: { ko: "복사됨", en: "Copied" } as LocalizedText,
};

const home = homeData as HomeData;

export const getSitePreviewImage = () => home.site?.previewImage || "https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/site/og-site-preview.webp";

export const getHomeGreeting = (lang: Language = defaultLanguage) =>
  localize(home.greeting, lang) || fallbackHomeGreeting[lang] || fallbackHomeGreeting[defaultLanguage];

export const getHomeContact = (lang: Language = defaultLanguage) => ({
  email: fallbackHomeContact.email,
  label: localize(fallbackHomeContact.label, lang),
  note: localize(fallbackHomeContact.note, lang),
  copied: localize(fallbackHomeContact.copied, lang),
});

export const getHomeCaption = (lang: Language = defaultLanguage) => localize(home.caption, lang);

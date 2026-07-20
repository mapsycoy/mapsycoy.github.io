import homeData from "./home.json";
import { defaultLanguage, localize, type Language, type LocalizedText } from "../utils/i18n";

type HomeMedia = {
  image?: string;  source?: LocalizedText;
  alt?: LocalizedText;
};

type HomeMusic = {
  title?: LocalizedText;
  artist?: LocalizedText;
  url?: string;
  audioFile?: string;
};

type HomeData = {
  site?: {
    previewImage?: string;
  };
  media?: HomeMedia;
  music?: HomeMusic;
  greeting?: LocalizedText;
  caption?: LocalizedText;
};

const fallbackHomeGreeting: Record<Language, string> = {
  ko: "\uC548\uB155\uD558\uC138\uC694.",
  en: "Welcome to my space.",
};

const fallbackHomeMedia: Required<HomeMedia> = {
  image: "https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/site/home-instrument.gif",  source: "Castle In The Sky | Studio Ghibli",
  alt: "Animated visual note",
};

const fallbackHomeMusic: Required<HomeMusic> = {
  title: "Castle In The Sky",
  artist: "Joe Hisaishi / YouTube",
  url: "https://www.youtube.com/results?search_query=Castle+In+The+Sky+Joe+Hisaishi",
  audioFile: "",
};

const home = homeData as HomeData;

export const getSitePreviewImage = () => home.site?.previewImage || "https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/site/og-site-preview.webp";

export const getHomeGreeting = (lang: Language = defaultLanguage) =>
  localize(home.greeting, lang) || fallbackHomeGreeting[lang] || fallbackHomeGreeting[defaultLanguage];

export const getHomeMedia = (lang: Language = defaultLanguage) => ({
  image: home.media?.image || fallbackHomeMedia.image,  source: localize(home.media?.source, lang) || localize(fallbackHomeMedia.source, lang),
  alt: localize(home.media?.alt, lang) || localize(fallbackHomeMedia.alt, lang),
});

export const getHomeMusic = (lang: Language = defaultLanguage) => ({
  title: localize(home.music?.title, lang) || localize(fallbackHomeMusic.title, lang),
  artist: localize(home.music?.artist, lang) || localize(fallbackHomeMusic.artist, lang),
  url: home.music?.url || fallbackHomeMusic.url,
  audioFile: home.music?.audioFile || fallbackHomeMusic.audioFile,
});

export const getHomeCaption = (lang: Language = defaultLanguage) => localize(home.caption, lang);

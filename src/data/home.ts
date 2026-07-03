import homeData from "./home.json";
import { defaultLanguage, localize, type Language, type LocalizedText } from "../utils/i18n";

type HomeMedia = {
  image?: string;
  halftoneFallback?: string;
  halftoneLargeFallback?: string;
  source?: LocalizedText;
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
  intro?: LocalizedText;
  caption?: LocalizedText;
};

const fallbackHomeGreeting: Record<Language, string> = {
  ko: "\uC548\uB155\uD558\uC138\uC694.",
  en: "Welcome to my space.",
};

const fallbackHomeMedia: Required<HomeMedia> = {
  image: "/uploads/home-instrument.gif",
  halftoneFallback: "/uploads/home-instrument-halftone.gif",
  halftoneLargeFallback: "/uploads/home-instrument-halftone-large.gif",
  source: "Castle In The Sky | Studio Ghibli",
  alt: "Animated visual note",
};

const fallbackHomeMusic: Required<HomeMusic> = {
  title: "Castle In The Sky",
  artist: "Joe Hisaishi / YouTube",
  url: "https://www.youtube.com/results?search_query=Castle+In+The+Sky+Joe+Hisaishi",
  audioFile: "",
};

const fallbackHomeIntro: Record<Language, string> = {
  ko: "\uC791\uC5C5, \uD504\uB85C\uC81D\uD2B8, \uC2E4\uD5D8, \uADF8\uB9AC\uACE0 \uADF8\uAC83\uB4E4\uC744 \uB9CC\uB4E4\uC5B4 \uC628 \uC9C8\uBB38\uB4E4\uC744 \uBAA8\uC544\uB454 \uC544\uCE74\uC774\uBE0C\uC785\uB2C8\uB2E4.",
  en: "This is an archive of my works, projects, experiments, and the questions that shaped them.",
};

const home = homeData as HomeData;

export const getSitePreviewImage = () => home.site?.previewImage || "/uploads/og-site-preview.webp";

export const getHomeGreeting = (lang: Language = defaultLanguage) =>
  localize(home.greeting, lang) || fallbackHomeGreeting[lang] || fallbackHomeGreeting[defaultLanguage];

export const getHomeMedia = (lang: Language = defaultLanguage) => ({
  image: home.media?.image || fallbackHomeMedia.image,
  halftoneFallback: home.media?.halftoneFallback || fallbackHomeMedia.halftoneFallback,
  halftoneLargeFallback: home.media?.halftoneLargeFallback || fallbackHomeMedia.halftoneLargeFallback,
  source: localize(home.media?.source, lang) || localize(fallbackHomeMedia.source, lang),
  alt: localize(home.media?.alt, lang) || localize(fallbackHomeMedia.alt, lang),
});

export const getHomeMusic = (lang: Language = defaultLanguage) => ({
  title: localize(home.music?.title, lang) || localize(fallbackHomeMusic.title, lang),
  artist: localize(home.music?.artist, lang) || localize(fallbackHomeMusic.artist, lang),
  url: home.music?.url || fallbackHomeMusic.url,
  audioFile: home.music?.audioFile || fallbackHomeMusic.audioFile,
});

export const getHomeCaption = (lang: Language = defaultLanguage) => localize(home.caption, lang);

export const getHomeIntro = (lang: Language = defaultLanguage) =>
  localize(home.intro, lang) || fallbackHomeIntro[lang] || fallbackHomeIntro[defaultLanguage];

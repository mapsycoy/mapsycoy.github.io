import homeData from "./home.json";
import { defaultLanguage, localize, type Language, type LocalizedText } from "../utils/i18n";

type HomeData = {
  greeting?: LocalizedText;
  intro?: LocalizedText;
  caption?: LocalizedText;
};

const fallbackHomeGreeting: Record<Language, string> = {
  ko: "\uC548\uB155\uD558\uC138\uC694.",
  en: "Welcome to my space.",
};

const fallbackHomeIntro: Record<Language, string> = {
  ko: "\uC791\uC5C5, \uD504\uB85C\uC81D\uD2B8, \uC2E4\uD5D8, \uADF8\uB9AC\uACE0 \uADF8\uAC83\uB4E4\uC744 \uB9CC\uB4E4\uC5B4 \uC628 \uC9C8\uBB38\uB4E4\uC744 \uBAA8\uC544\uB454 \uC544\uCE74\uC774\uBE0C\uC785\uB2C8\uB2E4.",
  en: "This is an archive of my works, projects, experiments, and the questions that shaped them.",
};

const home = homeData as HomeData;

export const getHomeGreeting = (lang: Language = defaultLanguage) =>
  localize(home.greeting, lang) || fallbackHomeGreeting[lang] || fallbackHomeGreeting[defaultLanguage];

export const getHomeCaption = (lang: Language = defaultLanguage) => localize(home.caption, lang);

export const getHomeIntro = (lang: Language = defaultLanguage) =>
  localize(home.intro, lang) || fallbackHomeIntro[lang] || fallbackHomeIntro[defaultLanguage];

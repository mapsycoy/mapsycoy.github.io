import homeData from "./home.json";
import { defaultLanguage, localize, type Language, type LocalizedText } from "../utils/i18n";

type HomeData = {
  caption?: LocalizedText;
};

const home = homeData as HomeData;

export const getHomeCaption = (lang: Language = defaultLanguage) => localize(home.caption, lang);

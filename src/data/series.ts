import seriesData from "./series.json";
import type { LocalizedText } from "../utils/i18n";

type SeriesMetadata = {
  number: number;
  title: LocalizedText;
  description: LocalizedText;
};

type SeriesData = Record<string, SeriesMetadata>;

export type SeriesId = keyof typeof seriesData;

export const series = seriesData as SeriesData & Record<SeriesId, SeriesMetadata>;

import seriesData from "./series.json";
import type { LocalizedText } from "../utils/i18n";

export type SeriesStatus = "active" | "archived";

type SeriesMetadata = {
  number: number;
  status?: SeriesStatus;
  /** Short label used in nav/filter chips. Falls back to title. */
  label?: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

type SeriesData = Record<string, SeriesMetadata>;

export type SeriesId = keyof typeof seriesData;

export const series = seriesData as SeriesData & Record<SeriesId, SeriesMetadata>;

/** Registry keys, ordered by the editorial number field. */
export const seriesIds = (Object.keys(seriesData) as SeriesId[]).sort(
  (a, b) => series[a].number - series[b].number
);

export const isSeriesId = (value: string | undefined | null): value is SeriesId =>
  typeof value === "string" && value in seriesData;

export const getSeriesMetadata = (value: string | undefined | null) =>
  isSeriesId(value) ? series[value] : undefined;

export const getSeriesStatus = (value: SeriesId): SeriesStatus =>
  series[value].status ?? "active";

export const formatSeriesNumber = (value: number) => String(value).padStart(2, "0");

export const getSeriesLabel = (id: SeriesId) => series[id].label ?? series[id].title;

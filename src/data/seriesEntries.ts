import type { BlogPost } from "./blog";
import type { NoteEntry } from "./notes";
import { getSeriesStatus, isSeriesId, series, type SeriesId } from "./series";
import { defaultLanguage, localize, type Language } from "../utils/i18n";

export type SeriesEntry = { kind: "blog"; item: BlogPost } | { kind: "note"; item: NoteEntry };

export const getSeriesEntryId = (entry: SeriesEntry) => `${entry.kind}:${entry.item.id}`;
export const getSeriesEntryTitle = (entry: SeriesEntry, lang: Language = defaultLanguage) =>
  entry.kind === "blog" ? localize(entry.item.data.title, lang) : lang === "en" ? entry.item.data.titleEn : entry.item.data.title;
export const getSeriesEntryPath = (entry: SeriesEntry, lang: Language = defaultLanguage) => {
  const prefix = lang === defaultLanguage ? "" : `/${lang}`;
  return entry.kind === "blog" ? `${prefix}/blog/${entry.item.data.slug}/` : `${prefix}/blog/notes/${entry.item.id}/`;
};
export const getSeriesEntryDate = (entry: SeriesEntry) => entry.kind === "blog" ? entry.item.data.publishedAt : entry.item.data.date;
export const getSeriesEntryFormat = (entry: SeriesEntry, lang: Language = defaultLanguage) =>
  entry.kind === "blog" ? entry.item.data.tag : lang === "ko" ? "노트" : "Note";

export const getSeriesEntries = (posts: BlogPost[], notes: NoteEntry[], seriesId: string) =>
  [...posts.map((item): SeriesEntry => ({ kind: "blog", item })), ...notes.map((item): SeriesEntry => ({ kind: "note", item }))]
    .filter((entry) => entry.item.data.series === seriesId)
    .sort((a, b) => (a.item.data.seriesOrder ?? Infinity) - (b.item.data.seriesOrder ?? Infinity));

export const getSeriesEntryPosition = (posts: BlogPost[], notes: NoteEntry[], target: SeriesEntry) => {
  const seriesId = target.item.data.series;
  if (!isSeriesId(seriesId)) return undefined;
  const entries = getSeriesEntries(posts, notes, seriesId);
  const index = entries.findIndex((entry) => getSeriesEntryId(entry) === getSeriesEntryId(target));
  return index < 0 ? undefined : { entries, index, seriesId };
};

export const getMixedSeriesGroups = (posts: BlogPost[], notes: NoteEntry[]) =>
  (Object.entries(series) as Array<[SeriesId, (typeof series)[SeriesId]]>)
    .map(([id, metadata]) => {
      const entries = getSeriesEntries(posts, notes, id);
      const latestDate = entries.reduce((latest, entry) => Math.max(latest, getSeriesEntryDate(entry).getTime()), 0);
      return { id, metadata, entries, latestDate, isArchived: getSeriesStatus(id) === "archived" };
    })
    .sort((a, b) => b.latestDate - a.latestDate || a.id.localeCompare(b.id));

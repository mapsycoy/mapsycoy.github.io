import { getCollection, type CollectionEntry } from "astro:content";
import { topicIds, type TopicId } from "./topics";
import type { Language } from "../utils/i18n";

export type NoteEntry = CollectionEntry<"notes">;

export const getNotes = async ({ includeDrafts = false } = {}) => {
  const notes = await getCollection("notes");
  const visibleNotes = includeDrafts ? notes : notes.filter((note) => note.data.status !== "draft");

  return [...visibleNotes].sort(
    (a, b) => (b.data.updated ?? b.data.date).getTime() - (a.data.updated ?? a.data.date).getTime()
  );
};

export const getUsedTopicIds = (notes: NoteEntry[]): TopicId[] =>
  topicIds.filter((topic) => notes.some((note) => note.data.topic === topic));

export const getNoteStatusLabel = (status: NoteEntry["data"]["status"], lang: Language) => {
  const labels = {
    draft: { ko: "초안", en: "Draft" },
    working: { ko: "작업 중", en: "Working" },
    settled: { ko: "정리됨", en: "Settled" },
  } as const;

  return labels[status][lang];
};

export const formatNoteDate = (date: Date, lang: Language) =>
  new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export const formatNoteYearMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year} · ${month}`;
};

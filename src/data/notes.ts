import { getCollection, type CollectionEntry } from "astro:content";
import type { Language } from "../utils/i18n";
import { titleFromNoteId } from "../utils/noteGarden.mjs";

export type NoteEntry = CollectionEntry<"notes">;

export const getNoteTitle = (note: NoteEntry, lang: Language) => {
  const sourcePath = (note as NoteEntry & { filePath?: string }).filePath;
  const filename = sourcePath?.replace(/\\/g, "/").split("/").pop();
  return (lang === "en" ? note.data.titleEn : note.data.title) ?? note.data.title ?? titleFromNoteId(filename ?? note.id);
};

export const getNoteDate = (note: NoteEntry) => note.data.updated ?? note.data.date;

export const getNotes = async ({ includeDrafts = false } = {}) => {
  const notes = await getCollection("notes");
  const visibleNotes = includeDrafts ? notes : notes.filter((note) => note.data.status !== "draft");

  return [...visibleNotes].sort((a, b) => {
    const dateDifference = (getNoteDate(b)?.getTime() ?? 0) - (getNoteDate(a)?.getTime() ?? 0);
    return dateDifference || getNoteTitle(a, "ko").localeCompare(getNoteTitle(b, "ko"), "ko");
  });
};

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

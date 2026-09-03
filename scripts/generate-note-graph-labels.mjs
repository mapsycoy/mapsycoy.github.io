import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const notesDir = path.join(rootDir, "src", "content", "notes");
const cachePath = path.join(rootDir, "src", "data", "note-graph-labels.json");

export const noteTitleHash = (title, titleEn = "") => {
  let hash = 2166136261;
  for (const character of `${title}\u0000${titleEn}`) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return (hash >>> 0).toString(36);
};

const scalar = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(value[0] === '"' ? /\\"/g : /''/g, value[0]);
  }
  return value;
};

const shorten = (title, maximum) => {
  const normalized = title.replace(/\s+/g, " ").trim();
  const characters = Array.from(normalized);
  if (characters.length <= maximum) return normalized;

  const visible = characters.slice(0, maximum - 1).join("");
  const boundary = visible.lastIndexOf(" ");
  const shortened = boundary >= Math.floor(maximum * 0.62) ? visible.slice(0, boundary) : visible;
  return `${shortened.replace(/[\s,;:—–-]+$/g, "")}…`;
};

const readNotes = async () => {
  const files = (await readdir(notesDir)).filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  return Promise.all(files.map(async (file) => {
    const source = await readFile(path.join(notesDir, file), "utf8");
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const id = file.replace(/\.md$/i, "");
    const title = scalar(frontmatter, "title") || id.replace(/[-_]+/g, " ");
    const titleEn = scalar(frontmatter, "titleEn") || title;
    return { id, title, titleEn };
  }));
};

export const generateNoteGraphLabels = async () => {
  const notes = await readNotes();
  const cache = {
    version: 2,
    entries: Object.fromEntries(notes.map(({ id, title, titleEn }) => [id, {
      sourceHash: noteTitleHash(title, titleEn),
      ko: shorten(title, 15),
      en: shorten(titleEn, 24),
    }])),
  };
  const next = `${JSON.stringify(cache, null, 2)}\n`;
  let current = "";
  try { current = await readFile(cachePath, "utf8"); } catch (error) { if (error?.code !== "ENOENT") throw error; }
  if (current !== next) await writeFile(cachePath, next, "utf8");
  console.log(current === next ? "Note graph labels are up to date." : `Updated ${notes.length} note graph labels.`);
  return { updated: current === next ? 0 : notes.length };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateNoteGraphLabels().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

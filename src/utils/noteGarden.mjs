import fs from "node:fs";
import path from "node:path";

const WIKILINK_PATTERN = /(?<!!)\[\[([^\]\n]+)\]\]/g;

export const normalizeNoteKey = (value = "") => {
  let decoded = String(value);
  try { decoded = decodeURIComponent(decoded); } catch { /* Keep malformed percent sequences literal. */ }
  return decoded.normalize("NFC")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/\.md$/i, "")
    .trim()
    .toLocaleLowerCase();
};

export const titleFromNoteId = (id) => {
  const filename = String(id).split("/").pop() || String(id);
  try {
    return decodeURIComponent(filename).normalize("NFC").replace(/[-_]+/g, " ");
  } catch {
    return filename.normalize("NFC").replace(/[-_]+/g, " ");
  }
};

export const noteIdFromRelativePath = (relativePath) =>
  String(relativePath)
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "")
    .split("/")
    .map((segment) => segment.normalize("NFC").trim().toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}\s_-]/gu, "").replace(/\s+/g, "-"))
    .join("/")
    .replace(/\/index$/, "");

export const splitWikilink = (raw) => {
  const [destination, ...aliasParts] = String(raw).split("|");
  const [target, ...headingParts] = destination.split("#");
  return {
    target: target.trim(),
    heading: headingParts.join("#").trim(),
    alias: aliasParts.join("|").trim(),
  };
};

export const splitAiOpinionBlocks = (markdown = "") => {
  const lines = String(markdown).split(/\r?\n/);
  const userLines = [];
  const aiOpinions = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*>\s*\[!ai-opinion\]/i.test(lines[index])) { userLines.push(lines[index]); continue; }
    const block = [lines[index]];
    while (index + 1 < lines.length && /^\s*>/.test(lines[index + 1])) block.push(lines[++index]);
    aiOpinions.push(block.join("\n"));
  }
  return { userContent: userLines.join("\n"), aiOpinions };
};

const extractWikilinksFromText = (markdown = "") => {
  const links = [];
  for (const match of String(markdown).matchAll(WIKILINK_PATTERN)) {
    const parsed = splitWikilink(match[1]);
    if (parsed.target) links.push({ ...parsed, raw: match[0] });
  }
  return links;
};

export const extractWikilinks = (markdown = "") => extractWikilinksFromText(splitAiOpinionBlocks(markdown).userContent);
export const extractAiOpinionWikilinks = (markdown = "") => splitAiOpinionBlocks(markdown).aiOpinions.flatMap(extractWikilinksFromText);
export const extractWikilinksByLayer = (markdown = "") => ({ user: extractWikilinks(markdown), ai: extractAiOpinionWikilinks(markdown) });

const stripYamlValue = (value) => value.trim().replace(/^(["'])(.*)\1$/, "$2");

export const readNoteSourceRecords = (baseDirectory = "./src/content/notes") => {
  const absoluteBase = path.resolve(baseDirectory);
  if (!fs.existsSync(absoluteBase)) return [];
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === ".obsidian" || entry.name.startsWith("_")) continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolutePath);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(absolutePath);
    }
  };
  walk(absoluteBase);
  return files.map((absolutePath) => {
    const source = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/)?.[1] || "";
    const getValue = (key) => {
      const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, "m"));
      return match ? stripYamlValue(match[1]) : undefined;
    };
    const relativePath = path.relative(absoluteBase, absolutePath).replace(/\\/g, "/");
    const id = noteIdFromRelativePath(relativePath);
    return { id, filename: relativePath.replace(/\.md$/i, ""), title: getValue("title") || titleFromNoteId(relativePath), status: getValue("status") || "working", body: source };
  });
};

export const createNoteResolver = (records) => {
  const lookup = new Map();
  const add = (key, record) => {
    const normalized = normalizeNoteKey(key);
    if (!normalized) return;
    const matches = lookup.get(normalized) || [];
    if (!matches.some((candidate) => candidate.id === record.id)) matches.push(record);
    lookup.set(normalized, matches);
  };
  for (const record of records.filter((item) => item.status !== "draft")) {
    add(record.id, record);
    add(record.id.split("/").pop(), record);
    add(record.filename, record);
    add(record.filename?.split("/").pop(), record);
    add(record.title, record);
  }
  return (target) => {
    const matches = lookup.get(normalizeNoteKey(target)) || [];
    return matches.length === 1 ? matches[0] : undefined;
  };
};

export const noteHeadingSlug = (heading) =>
  String(heading)
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s_-]/gu, "")
    .replace(/\s+/g, "-");

import { createNoteResolver, noteHeadingSlug, readNoteSourceRecords, splitWikilink } from "./noteGarden.mjs";

const linkPattern = /(?<!!)\[\[([^\]\n]+)\]\]/g;
const warned = new Set();

const textNodeParts = (value, resolve, sourceName, sourceDepth) => {
  const parts = [];
  let cursor = 0;
  for (const match of value.matchAll(linkPattern)) {
    if (match.index > cursor) parts.push({ type: "text", value: value.slice(cursor, match.index) });
    const parsed = splitWikilink(match[1]);
    const target = resolve(parsed.target);
    const label = parsed.alias || parsed.heading || parsed.target;
    if (target) {
      const fragment = parsed.heading ? `#${encodeURIComponent(noteHeadingSlug(parsed.heading))}` : "";
      parts.push({
        type: "link",
        url: `${"../".repeat(sourceDepth)}${target.id.split("/").map(encodeURIComponent).join("/")}/${fragment}`,
        data: { hProperties: { className: ["note-wikilink"], "data-note-id": target.id } },
        children: [{ type: "text", value: label }],
      });
    } else {
      parts.push({
        type: "text",
        value: label,
        data: { hName: "span", hProperties: { className: ["note-wikilink-unresolved"], title: `Unresolved note: ${parsed.target}` } },
      });
      const warningKey = `${sourceName || "note"}:${parsed.target}`;
      if (!warned.has(warningKey)) {
        warned.add(warningKey);
        console.warn(`[notes] Unresolved wikilink in ${sourceName || "unknown note"}: [[${match[1]}]]`);
      }
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) parts.push({ type: "text", value: value.slice(cursor) });
  return parts;
};

export default function remarkWikilinks(options = {}) {
  return (tree, file) => {
    const records = readNoteSourceRecords(options.baseDirectory);
    const resolve = createNoteResolver(records);
    const sourcePath = String(file.path || file.history?.[0] || "").replace(/\\/g, "/");
    if (!sourcePath.includes("/content/notes/")) return;
    const sourceRecord = records.find((record) => sourcePath.endsWith(`/content/notes/${record.filename}.md`));
    const sourceDepth = Math.max(1, sourceRecord?.id.split("/").length ?? 1);

    const visit = (node) => {
      if (!node?.children || ["link", "linkReference", "code", "inlineCode"].includes(node.type)) return;
      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        if (child.type === "text" && linkPattern.test(child.value)) {
          linkPattern.lastIndex = 0;
          const parts = textNodeParts(child.value, resolve, sourcePath, sourceDepth);
          node.children.splice(index, 1, ...parts);
          index += parts.length - 1;
        } else visit(child);
        linkPattern.lastIndex = 0;
      }
    };
    visit(tree);
  };
}

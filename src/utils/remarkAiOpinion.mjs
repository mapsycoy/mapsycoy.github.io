const MODES = new Set(["Interpretation", "Counterargument", "Extension", "Question", "Connection"]);

const plainText = (node) => node?.type === "text" ? node.value : node?.children ? node.children.map(plainText).join("") : "";
const paragraph = (className, children) => ({ type: "paragraph", data: { hProperties: { className: [className] } }, children });

export default function remarkAiOpinion() {
  return (tree, file) => {
    const visit = (node) => {
      if (!node?.children) return;
      node.children.forEach((child) => {
        if (child.type !== "blockquote") return visit(child);
        const first = child.children?.[0];
        const content = plainText(first);
        if (!/^\[!ai-opinion\]\s+AI OPINION(?:\n|$)/i.test(content)) return visit(child);

        const metadata = Object.fromEntries([...content.matchAll(/^(Contributor|Date|Mode):\s*(.+)$/gmi)].map((match) => [match[1].toLowerCase(), match[2].trim()]));
        const missing = ["contributor", "date", "mode"].filter((key) => !metadata[key]);
        if (missing.length) console.warn(`[notes] AI OPINION in ${file.path || "unknown note"} is missing: ${missing.join(", ")}`);
        if (metadata.mode && !MODES.has(metadata.mode)) console.warn(`[notes] AI OPINION in ${file.path || "unknown note"} has unsupported mode: ${metadata.mode}`);

        child.data = { hName: "aside", hProperties: { className: ["ai-opinion"], role: "note", "aria-label": "AI OPINION" } };
        child.children = [
          paragraph("ai-opinion-label", [{ type: "text", value: "AI OPINION" }]),
          paragraph("ai-opinion-meta", [{ type: "strong", children: [{ type: "text", value: "Contributor:" }] }, { type: "text", value: ` ${metadata.contributor || "—"}` }]),
          paragraph("ai-opinion-meta", [{ type: "strong", children: [{ type: "text", value: "Date:" }] }, { type: "text", value: ` ${metadata.date || "—"}` }]),
          paragraph("ai-opinion-meta", [{ type: "strong", children: [{ type: "text", value: "Mode:" }] }, { type: "text", value: ` ${metadata.mode || "—"}` }]),
          ...child.children.slice(1),
        ];
      });
    };
    visit(tree);
  };
}

const MARK_BLOCK_PATTERN = /(<mark(?:\s[^>]*)?>)([\s\S]*?)(<\/mark>)/gi;
const STRONG_PATTERN = /(?<!\\)\*\*([^*\n](?:[\s\S]*?[^*\n])?)\*\*/g;

/**
 * Parse bold Markdown inside multiline <mark> HTML blocks.
 *
 * CommonMark treats a standalone opening <mark> tag and everything up to its
 * closing tag as raw HTML, so `**text**` would otherwise be emitted literally.
 */
export default function remarkMarkStrong() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "html" && typeof node.value === "string") {
        node.value = node.value.replace(
          MARK_BLOCK_PATTERN,
          (_, openingTag, content, closingTag) =>
            `${openingTag}${content.replace(STRONG_PATTERN, "<strong>$1</strong>")}${closingTag}`,
        );
      }

      if (Array.isArray(node.children)) node.children.forEach(visit);
    };

    visit(tree);
  };
}

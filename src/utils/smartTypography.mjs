const leftSingleQuote = "‘";
const rightSingleQuote = "’";
const leftDoubleQuote = "“";
const rightDoubleQuote = "”";

const isWordCharacter = (value) => /[A-Za-z0-9]/.test(value ?? "");
const isOpeningContext = (value) => !value || /[\s([{<*_~`\u2026\u2014\u2013,:;!?]/.test(value);

const hasClosingQuote = (chars, startIndex, quote) =>
  chars.slice(startIndex + 1).includes(quote);

export const smartenText = (value) => {
  if (!value) return "";

  const chars = Array.from(value);
  let result = "";
  let doubleQuoteOpen = false;
  let singleQuoteOpen = false;

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const previous = result.at(-1) ?? "";
    const next = chars[index + 1] ?? "";

    if (char === '"') {
      const opens = !doubleQuoteOpen && (hasClosingQuote(chars, index, char) || isOpeningContext(previous));
      result += opens ? leftDoubleQuote : rightDoubleQuote;
      doubleQuoteOpen = opens;
      continue;
    }

    if (char === "'") {
      if (isWordCharacter(previous) && isWordCharacter(next)) {
        result += rightSingleQuote;
      } else if (/\d/.test(next) && isOpeningContext(previous)) {
        result += rightSingleQuote;
      } else {
        const opens = !singleQuoteOpen && (hasClosingQuote(chars, index, char) || isOpeningContext(previous));
        result += opens ? leftSingleQuote : rightSingleQuote;
        singleQuoteOpen = opens;
      }
      continue;
    }

    result += char;
  }

  return result;
};

const skippedElementNames = new Set(["code", "kbd", "pre", "script", "style"]);

const visit = (node, parent) => {
  if (!node) return;

  if (node.type === "text") {
    node.value = smartenText(node.value);
    return;
  }

  if (node.type === "element" && skippedElementNames.has(node.tagName)) return;
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, node);
  }
};

export default function rehypeSmartTypography() {
  return (tree) => {
    visit(tree, null);
  };
}
const getText = (node) => {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getText).join("");
};

const createText = (value) => ({
  type: "text",
  value,
});

const createSpan = (className, value) => ({
  type: "element",
  tagName: "span",
  properties: { className },
  children: [createText(value)],
});

const hasKoreanText = (value) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value);

const addClassName = (node, className) => {
  const currentClassName = node.properties?.className;
  const classNames = Array.isArray(currentClassName)
    ? currentClassName
    : typeof currentClassName === "string"
      ? currentClassName.split(/\s+/).filter(Boolean)
      : [];

  if (!classNames.includes(className)) {
    classNames.push(className);
  }

  node.properties = {
    ...(node.properties ?? {}),
    className: classNames,
  };
};

const getHost = (value) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

const createLinkPreviewChildren = (href, title) => [
  {
    type: "element",
    tagName: "a",
    properties: {
      href,
      target: "_blank",
      rel: ["noreferrer"],
    },
    children: [
      createSpan("text-link-preview-label", "Link"),
      createSpan("text-link-preview-title", title || getHost(href)),
      createSpan("text-link-preview-url", href),
    ],
  },
];

const getBrokenBracketLinkPreview = (node) => {
  if (node?.type !== "element" || node.tagName !== "p" || !Array.isArray(node.children)) return null;

  const links = node.children.filter((child) => child.type === "element" && child.tagName === "a");
  if (links.length !== 1) return null;

  const link = links[0];
  const linkIndex = node.children.indexOf(link);
  const before = node.children.slice(0, linkIndex).map(getText).join("");
  const after = node.children.slice(linkIndex + 1).map(getText).join("");
  const href = typeof link.properties?.href === "string" ? link.properties.href : "";

  if (!href || after.trim() !== ")") return null;
  if (!before.trim().startsWith("[") || !before.trim().endsWith("](")) return null;

  const title = before
    .trim()
    .replace(/^\[/, "")
    .replace(/\]\($/, "")
    .replace(/\\([\[\]])/g, "$1")
    .trim();

  return { href, title };
};

const visit = (node) => {
  if (!node || !Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child?.type === "element" && child.tagName === "figcaption" && hasKoreanText(getText(child))) {
      addClassName(child, "ko-title");
    }

    const preview = getBrokenBracketLinkPreview(child);

    if (preview) {
      child.properties = {
        ...(child.properties ?? {}),
        className: "text-link-preview",
      };
      child.children = createLinkPreviewChildren(preview.href, preview.title);
      continue;
    }

    visit(child);
  }
};

export default function rehypeLinkPreviews() {
  return (tree) => {
    visit(tree);
  };
}

const sectionNames = new Map([
  ["결과 문장", "result"],
  ["확신 없는 곳", "uncertain"],
]);

const getText = (node) => {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getText).join("");
};

const markSections = (node) => {
  if (!node || !Array.isArray(node.children)) return;

  node.children.forEach(markSections);

  const children = [];
  for (let index = 0; index < node.children.length;) {
    const child = node.children[index];
    const sectionName = child?.type === "element" && child.tagName === "h2"
      ? sectionNames.get(getText(child).trim())
      : undefined;

    if (!sectionName) {
      children.push(child);
      index += 1;
      continue;
    }

    const sectionChildren = [child];
    index += 1;
    while (index < node.children.length) {
      const sibling = node.children[index];
      if (sibling?.type === "element" && sibling.tagName === "h2") break;
      sectionChildren.push(sibling);
      index += 1;
    }

    children.push({
      type: "element",
      tagName: "section",
      properties: { dataSection: sectionName },
      children: sectionChildren,
    });
  }

  node.children = children;
};

export default function rehypeNoteSections() {
  return (tree) => {
    markSections(tree);
  };
}

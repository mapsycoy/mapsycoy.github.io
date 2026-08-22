const escapeCssString = (value: string) => value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
const limitDescription = (value: string, maxLength = 180) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : maxLength).trimEnd()}…`;
};

export const buildLinkPreviewStyles = (items: Array<{ url: string; image: string; description: string }>) =>
  items
    .map(({ url, image, description }) => {
      const selector = `.blog-post-body .text-link-preview > a[href="${escapeCssString(url)}"]`;
      const limitedDescription = limitDescription(description);
      const hideUrl = `${selector} .text-link-preview-url{display:none}`;
      const titleStyle = `${selector} .text-link-preview-title{display:block;min-width:0;color:var(--text);font-size:1.1rem;font-weight:700;line-height:1.25;grid-column:${image ? "2" : "1"};grid-row:1}`;
      const descriptionStyle = limitedDescription
        ? `${selector}::after{content:"${escapeCssString(limitedDescription)}";display:-webkit-box;min-width:0;margin-top:4px;overflow:hidden;color:var(--muted);font-size:.92rem;line-height:1.4;-webkit-box-orient:vertical;-webkit-line-clamp:3;grid-column:${image ? "2" : "1"};grid-row:2}`
        : "";
      const imageStyle = image
        ? `${selector}{grid-template-columns:128px minmax(0,1fr);grid-template-rows:min-content min-content 1fr;column-gap:16px;row-gap:0;align-items:start;padding:18px}${selector}::before{content:"";display:block;min-width:0;aspect-ratio:1/1;border:1px solid var(--line);background:var(--soft) url("${escapeCssString(image)}") center/cover no-repeat;grid-column:1;grid-row:1/span 3}`
        : "";
      const mobileStyle = image
        ? `@media(max-width:680px){${selector}{grid-template-columns:76px minmax(0,1fr);grid-template-rows:min-content min-content 1fr;column-gap:12px;padding:14px}${selector}::before{grid-column:1;grid-row:1/span 3;margin-bottom:0}${selector} .text-link-preview-title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;grid-column:2;grid-row:1}${selector}::after{-webkit-line-clamp:1;grid-column:2;grid-row:2}}`
        : "";
      return `${hideUrl}${titleStyle}${descriptionStyle}${imageStyle}${mobileStyle}`;
    })
    .join("");

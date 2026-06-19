const metadataCache = new Map<string, Promise<string>>();

const META_IMAGE_KEYS = new Set([
  "og:image",
  "og:image:url",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
]);

const getAttributeValue = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i"));
  if (!match) return "";

  return match[1].replace(/^["']|["']$/g, "").trim();
};

const decodeHtml = (value: string) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const toAbsoluteUrl = (value: string, pageUrl: string) => {
  try {
    return new URL(decodeHtml(value), pageUrl).toString();
  } catch {
    return "";
  }
};

const extractPreviewImage = (html: string, pageUrl: string) => {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const key = (getAttributeValue(tag, "property") || getAttributeValue(tag, "name")).toLowerCase();
    if (!META_IMAGE_KEYS.has(key)) continue;

    const content = getAttributeValue(tag, "content");
    if (content) return toAbsoluteUrl(content, pageUrl);
  }

  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const rel = getAttributeValue(tag, "rel").toLowerCase();
    if (!rel.split(/\s+/).includes("image_src")) continue;

    const href = getAttributeValue(tag, "href");
    if (href) return toAbsoluteUrl(href, pageUrl);
  }

  return "";
};

const fetchPreviewImage = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 (compatible; mapsycoy-link-preview/1.0)",
      },
      signal: controller.signal,
    });

    if (!response.ok) return "";

    const html = await response.text();
    return extractPreviewImage(html, response.url || url);
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
};

export const getLinkPreviewImage = (url: string) => {
  const trimmedUrl = url.trim();

  if (!/^https?:\/\//i.test(trimmedUrl)) {
    return Promise.resolve("");
  }

  if (!metadataCache.has(trimmedUrl)) {
    metadataCache.set(trimmedUrl, fetchPreviewImage(trimmedUrl));
  }

  return metadataCache.get(trimmedUrl) ?? Promise.resolve("");
};

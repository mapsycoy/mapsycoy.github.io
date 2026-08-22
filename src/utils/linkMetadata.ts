type LinkPreviewMetadata = {
  image: string;
  description: string;
};

const metadataCache = new Map<string, Promise<LinkPreviewMetadata>>();

const META_IMAGE_KEYS = new Set([
  "og:image",
  "og:image:url",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
]);

const META_DESCRIPTION_KEYS = new Set(["og:description", "twitter:description", "description"]);

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

const extractPreviewMetadata = (html: string, pageUrl: string): LinkPreviewMetadata => {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  let image = "";
  let description = "";

  for (const tag of metaTags) {
    const key = (getAttributeValue(tag, "property") || getAttributeValue(tag, "name")).toLowerCase();
    const content = getAttributeValue(tag, "content");
    if (!content) continue;

    if (!image && META_IMAGE_KEYS.has(key)) image = toAbsoluteUrl(content, pageUrl);
    if (!description && META_DESCRIPTION_KEYS.has(key)) {
      description = decodeHtml(content).replace(/\s+/g, " ").trim();
    }
  }

  if (!image) {
    const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

    for (const tag of linkTags) {
      const rel = getAttributeValue(tag, "rel").toLowerCase();
      if (!rel.split(/\s+/).includes("image_src")) continue;

      const href = getAttributeValue(tag, "href");
      if (href) {
        image = toAbsoluteUrl(href, pageUrl);
        break;
      }
    }
  }

  return { image, description };
};

const fetchPreviewMetadata = async (url: string): Promise<LinkPreviewMetadata> => {
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

    if (!response.ok) return { image: "", description: "" };

    const html = await response.text();
    return extractPreviewMetadata(html, response.url || url);
  } catch {
    return { image: "", description: "" };
  } finally {
    clearTimeout(timeout);
  }
};

export const getLinkPreviewMetadata = (url: string) => {
  const trimmedUrl = url.trim();

  if (!/^https?:\/\//i.test(trimmedUrl)) {
    return Promise.resolve({ image: "", description: "" });
  }

  if (!metadataCache.has(trimmedUrl)) {
    metadataCache.set(trimmedUrl, fetchPreviewMetadata(trimmedUrl));
  }

  return metadataCache.get(trimmedUrl) ?? Promise.resolve({ image: "", description: "" });
};

export const getLinkPreviewImage = async (url: string) => (await getLinkPreviewMetadata(url)).image;

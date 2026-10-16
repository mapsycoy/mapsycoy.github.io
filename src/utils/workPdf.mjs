/** Accept Drive file links only; never render pasted HTML or arbitrary iframe URLs. */
export function getWorkPdfUrls(value) {
  if (typeof value !== "string") return null;
  const input = value.trim();
  if (/[\u0000-\u0020\u007f\\]/.test(input)) return null;

  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.hostname !== "drive.google.com" ||
        url.port || url.username || url.password) return null;

    const filePath = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/(?:view|preview))?\/?$/);
    const isLegacyLink = /^\/(?:open|uc)\/?$/.test(url.pathname);
    const ids = url.searchParams.getAll("id");
    const fileId = filePath?.[1] ?? (isLegacyLink && ids.length === 1 ? ids[0] : "");
    if (!/^[A-Za-z0-9_-]+$/.test(fileId)) return null;
    if (filePath && ids.length) return null;

    // Some public Drive shares require this key even when the file ID is known.
    const keys = url.searchParams.getAll("resourcekey");
    if (keys.length > 1 || (keys.length === 1 && !/^[A-Za-z0-9_-]+$/.test(keys[0]))) return null;
    const query = keys.length ? `?resourcekey=${encodeURIComponent(keys[0])}` : "";
    const base = `https://drive.google.com/file/d/${fileId}`;
    return { previewUrl: `${base}/preview${query}`, originalUrl: `${base}/view${query}` };
  } catch {
    return null;
  }
}

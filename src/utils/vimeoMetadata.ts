const aspectRatioCache = new Map<string, Promise<number>>();

const fetchVimeoAspectRatio = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const endpoint = new URL("https://vimeo.com/api/oembed.json");
    endpoint.searchParams.set("url", url);
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) return 16 / 9;

    const metadata = (await response.json()) as { width?: number; height?: number };
    return metadata.width && metadata.height ? metadata.width / metadata.height : 16 / 9;
  } catch {
    return 16 / 9;
  } finally {
    clearTimeout(timeout);
  }
};

export const getVimeoAspectRatio = (url: string) => {
  if (!url.includes("player.vimeo.com/video/")) return Promise.resolve(16 / 9);
  if (!aspectRatioCache.has(url)) aspectRatioCache.set(url, fetchVimeoAspectRatio(url));
  return aspectRatioCache.get(url) ?? Promise.resolve(16 / 9);
};

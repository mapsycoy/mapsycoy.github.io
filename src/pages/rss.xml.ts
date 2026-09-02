import rss from "@astrojs/rss";
import { getBlogPosts } from "../data/blog";
import { getNotes } from "../data/notes";
import { notesToRssItems, toRssItems } from "../data/rss";

export async function GET({ site }: { site: URL }) {
  const posts = await getBlogPosts();
  const notes = await getNotes();
  const items = [...toRssItems(posts, site), ...notesToRssItems(notes, site)].sort(
    (a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0)
  );
  return rss({
    title: "mapsycoy — All",
    description: "Published writing and study notes from mapsycoy.",
    site,
    items,
  });
}

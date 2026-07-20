import rss from "@astrojs/rss";
import { getBlogPosts } from "../data/blog";
import { toRssItems } from "../data/rss";

export async function GET({ site }: { site: URL }) {
  const posts = await getBlogPosts();
  return rss({
    title: "mapsycoy — Blog",
    description: "Published writing from mapsycoy.",
    site,
    items: toRssItems(posts, site),
  });
}

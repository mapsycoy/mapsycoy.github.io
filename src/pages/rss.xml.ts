import rss from "@astrojs/rss";
import { getBlogPosts } from "../data/blog";
import { canonicalSite, toRssItems } from "../data/rss";

export async function GET() {
  const posts = await getBlogPosts();
  return rss({
    title: "mapsycoy — Blog",
    description: "Published writing from mapsycoy.",
    site: canonicalSite,
    items: toRssItems(posts),
  });
}

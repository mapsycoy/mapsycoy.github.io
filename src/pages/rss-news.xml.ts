import rss from "@astrojs/rss";
import { getBlogPosts, getNewsPosts } from "../data/blog";
import { canonicalSite, toRssItems } from "../data/rss";

export async function GET() {
  const posts = getNewsPosts(await getBlogPosts());
  return rss({
    title: "mapsycoy — AI News",
    description: "AI News published by mapsycoy.",
    site: canonicalSite,
    items: toRssItems(posts),
  });
}

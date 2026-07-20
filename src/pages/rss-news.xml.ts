import rss from "@astrojs/rss";
import { getBlogPosts, getNewsPosts } from "../data/blog";
import { toRssItems } from "../data/rss";

export async function GET({ site }: { site: URL }) {
  const posts = getNewsPosts(await getBlogPosts());
  return rss({
    title: "mapsycoy — AI News",
    description: "AI News published by mapsycoy.",
    site,
    items: toRssItems(posts, site),
  });
}

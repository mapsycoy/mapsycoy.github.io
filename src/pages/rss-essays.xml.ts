import rss from "@astrojs/rss";
import { getBlogPosts, sortBlogPosts } from "../data/blog";
import { canonicalSite, toRssItems } from "../data/rss";

export async function GET() {
  const posts = sortBlogPosts((await getBlogPosts()).filter((post) => post.data.tag !== "AI News"));
  return rss({
    title: "mapsycoy — Essays & Papers",
    description: "Essays and papers published by mapsycoy.",
    site: canonicalSite,
    items: toRssItems(posts),
  });
}

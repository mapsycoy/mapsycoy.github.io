import rss from "@astrojs/rss";
import { getBlogPosts, sortBlogPosts } from "../data/blog";
import { toRssItems } from "../data/rss";

export async function GET({ site }: { site: URL }) {
  const posts = sortBlogPosts((await getBlogPosts()).filter((post) => post.data.tag !== "AI News"));
  return rss({
    title: "mapsycoy — Essays & Papers",
    description: "Essays and papers published by mapsycoy.",
    site,
    items: toRssItems(posts, site),
  });
}

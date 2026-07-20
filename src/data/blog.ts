import { getCollection, type CollectionEntry } from "astro:content";

export type BlogTag = "Essay" | "AI News" | "Paper";
export type BlogPost = CollectionEntry<"blog">;

export const blogTags: BlogTag[] = ["Essay", "AI News", "Paper"];
export const blogPostsPerPage = 8;

export const normalizeBlogTag = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getBlogPostSlug = (post: BlogPost) => post.data.slug;

export const getBlogTagBySlug = (slug: string | undefined) =>
  blogTags.find((tag) => normalizeBlogTag(tag) === slug);

export const hasKoreanText = (value: string) => /[\uac00-\ud7a3]/.test(value);

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);

export const getPostDateLabel = (publishedAt: Date, updatedAt?: Date) => {
  const publishedLabel = `Published ${formatPostDate(publishedAt)}`;

  if (!updatedAt) return publishedLabel;

  return `${publishedLabel} / Updated ${formatPostDate(updatedAt)}`;
};

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) {
      return a.data.pinned ? -1 : 1;
    }

    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });

export const sortSeriesPosts = (posts: BlogPost[]) =>
  [...posts].sort((a, b) =>
    (a.data.seriesOrder ?? Number.POSITIVE_INFINITY) -
    (b.data.seriesOrder ?? Number.POSITIVE_INFINITY)
  );

export const getSeriesPosts = (posts: BlogPost[], seriesId: string) =>
  sortSeriesPosts(posts.filter((post) => post.data.series === seriesId));

export const getNewsPosts = (posts: BlogPost[]) =>
  sortBlogPosts(posts.filter((post) => post.data.tag === "AI News"));

export const getNonSeriesPosts = (posts: BlogPost[]) =>
  sortBlogPosts(posts.filter((post) => !post.data.series && post.data.tag !== "AI News"));

export const getSeriesPosition = (posts: BlogPost[], post: BlogPost) => {
  if (!post.data.series) return undefined;

  const seriesPosts = getSeriesPosts(posts, post.data.series);
  const index = seriesPosts.findIndex((candidate) => getBlogPostSlug(candidate) === getBlogPostSlug(post));
  if (index < 0) return undefined;

  return {
    posts: seriesPosts,
    index,
    previous: seriesPosts[index - 1],
    next: seriesPosts[index + 1],
  };
};

export const getBlogPosts = async ({ includeDrafts = false } = {}) => {
  const posts = await getCollection("blog");
  const visiblePosts = includeDrafts ? posts : posts.filter((post) => post.data.status === "published");

  return sortBlogPosts(visiblePosts);
};

export const getBlogPageCount = (posts: BlogPost[], pageSize = blogPostsPerPage) =>
  Math.max(1, Math.ceil(posts.length / pageSize));

export const getBlogPagePosts = (posts: BlogPost[], page: number, pageSize = blogPostsPerPage) => {
  const startIndex = (page - 1) * pageSize;
  return posts.slice(startIndex, startIndex + pageSize);
};

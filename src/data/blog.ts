import { getCollection, type CollectionEntry } from "astro:content";

export type BlogTag = "Essay" | "AI" | "Paper";
export type BlogPost = CollectionEntry<"blog">;

export const blogTags: BlogTag[] = ["Essay", "AI", "Paper"];

export const hasKoreanText = (value: string) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value);

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

export const getBlogPosts = async ({ includeDrafts = false } = {}) => {
  const posts = await getCollection("blog");
  const visiblePosts = includeDrafts ? posts : posts.filter((post) => post.data.status === "published");

  return sortBlogPosts(visiblePosts);
};

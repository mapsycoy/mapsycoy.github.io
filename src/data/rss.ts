import type { BlogPost } from "./blog";
import { localize } from "../utils/i18n";

export const localizeKoreanFirst = (value: BlogPost["data"]["title"] | BlogPost["data"]["summary"]) =>
  localize(value, "ko", "en").trim();

export const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_~`|]/g, "")
    .replace(/\[\^[^\]]+\](?::[^\n]*)?/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getRssDescription = (post: BlogPost, maxLength = 220) => {
  const summary = localizeKoreanFirst(post.data.summary);
  const firstTextBlock = post.data.contentBlocks.find((block) => block.type === "text");
  const source = summary || (firstTextBlock ? localize(firstTextBlock.body, "ko", "en") : "");
  const plainText = stripMarkdown(source);

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}…`;
};

export const toRssItems = (posts: BlogPost[], site: URL) =>
  posts.map((post) => ({
    title: localizeKoreanFirst(post.data.title),
    description: getRssDescription(post),
    pubDate: post.data.publishedAt,
    link: new URL(`/blog/${post.data.slug}`, site).toString(),
  }));

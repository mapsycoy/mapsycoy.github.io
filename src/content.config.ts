import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const statusSchema = z.enum(["draft", "published"]).default("published");
const workTypeSchema = z.enum(["independent", "collaborative"]).default("independent");

const imagePathSchema = z.string().default("");
const requiredImagePathSchema = z.string().min(1);
const localizedTextSchema = z.union([
  z.string(),
  z.object({
    ko: z.string().default(""),
    en: z.string().default(""),
  }),
]);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: localizedTextSchema,
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: statusSchema,
    pinned: z.boolean().default(false),
    tag: z.enum(["Essay", "AI", "Paper"]),
    thumbnail: imagePathSchema,
    heroImage: imagePathSchema,
    heroImageCaption: localizedTextSchema.default(""),
    contentBlocks: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("text"),
            body: localizedTextSchema,
          }),
          z.object({
            type: z.literal("image"),
            src: z.string(),
            caption: localizedTextSchema.default(""),
          }),
          z.object({
            type: z.literal("link"),
            title: localizedTextSchema,
            url: z.string(),
            subtitle: localizedTextSchema.default(""),
          }),
          z.object({
            type: z.literal("divider"),
          }),
        ])
      )
      .default([]),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: localizedTextSchema,
    year: z.string(),
    status: statusSchema,
    workType: workTypeSchema,
    artistOrRole: localizedTextSchema.optional(),
    venue: localizedTextSchema.optional(),
    summary: localizedTextSchema.optional(),
    tags: z.array(z.string()).default([]),
    thumbnail: requiredImagePathSchema,
    heroImage: imagePathSchema,
    heroImageDisplay: z.enum(["full", "contained"]).default("full"),
    heroImageCaption: localizedTextSchema.default(""),
    videoUrl: z.string().default(""),
    videos: z
      .array(
        z.object({
          embed: z.string(),
          caption: localizedTextSchema.optional(),
        })
      )
      .default([]),
    contentBlocks: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("text"),
            body: localizedTextSchema,
          }),
          z.object({
            type: z.literal("video"),
            embed: z.string(),
            caption: localizedTextSchema.optional(),
          }),
          z.object({
            type: z.literal("embed"),
            provider: z.enum(["x", "reddit"]),
            embedCode: z.string().default(""),
            url: z.string().default(""),
            caption: localizedTextSchema.optional(),
          }),
          z.object({
            type: z.literal("statsLink"),
            title: localizedTextSchema,
            url: z.string(),
            subtitle: localizedTextSchema.optional(),
            ctaLabel: localizedTextSchema.default("View link"),
            stats: z
              .array(
                z.object({
                  label: localizedTextSchema,
                  value: z.string(),
                })
              )
              .default([]),
          }),
        ])
      )
      .default([]),
  }),
});

export const collections = { blog, works };

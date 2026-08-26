import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import seriesRegistry from "./data/series.json";

const registeredSeriesIds = Object.keys(seriesRegistry);
const seriesIdSchema = z.string().refine((value) => registeredSeriesIds.includes(value), {
  message: `Unknown series id. Register it in src/data/series.json first. Known ids: ${registeredSeriesIds.join(", ")}`,
});

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
    slug: z.string().regex(/^\d+$/),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: statusSchema,
    pinned: z.boolean().default(false),
    tag: z.enum(["Essay", "AI News", "Paper Review"]),
    series: seriesIdSchema.optional(),
    seriesOrder: z.number().int().positive().optional(),
    summary: localizedTextSchema.optional(),
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
            type: z.literal("embed"),
            provider: z.enum(["x", "reddit"]),
            embedCode: z.string().default(""),
            url: z.string().default(""),
            caption: localizedTextSchema.optional(),
          }),
          z.object({
            type: z.literal("divider"),
          }),
        ])
      )
      .default([]),
  }).superRefine((data, context) => {
    if (data.series && data.seriesOrder === undefined) {
      context.addIssue({
        code: "custom",
        path: ["seriesOrder"],
        message: "seriesOrder is required when series is set.",
      });
    }

    if (!data.series && data.seriesOrder !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["series"],
        message: "series is required when seriesOrder is set.",
      });
    }
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
    locationMap: z.string().optional(),
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
            type: z.literal("specialThanks"),
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

const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(["draft", "working", "settled"]).default("working"),
    tags: z.array(z.string()).default([]),
    series: seriesIdSchema.optional(),
    seriesOrder: z.number().int().positive().optional(),
  }).superRefine((data, context) => {
    if (data.series && data.seriesOrder === undefined) {
      context.addIssue({ code: "custom", path: ["seriesOrder"], message: "seriesOrder is required when series is set." });
    }
    if (!data.series && data.seriesOrder !== undefined) {
      context.addIssue({ code: "custom", path: ["series"], message: "series is required when seriesOrder is set." });
    }
  }),
});

export const collections = { blog, works, notes };

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const statusSchema = z.enum(["draft", "published"]).default("published");

const imagePathSchema = z.string().default("");
const requiredImagePathSchema = z.string().min(1);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: statusSchema,
    pinned: z.boolean().default(false),
    tag: z.enum(["Essay", "AI", "Paper"]),
    thumbnail: imagePathSchema,
    heroImage: imagePathSchema,
    heroImageCaption: z.string().default(""),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    status: statusSchema,
    artistOrRole: z.string().optional(),
    venue: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    thumbnail: requiredImagePathSchema,
    heroImage: imagePathSchema,
    heroImageCaption: z.string().default(""),
    videoUrl: z.string().default(""),
    videos: z
      .array(
        z.object({
          embed: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
    contentBlocks: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("text"),
            body: z.string(),
          }),
          z.object({
            type: z.literal("video"),
            embed: z.string(),
            caption: z.string().optional(),
          }),
          z.object({
            type: z.literal("statsLink"),
            title: z.string(),
            url: z.string(),
            subtitle: z.string().optional(),
            ctaLabel: z.string().default("View link"),
            stats: z
              .array(
                z.object({
                  label: z.string(),
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

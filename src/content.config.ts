import { glob } from "astro/loaders"; // Not available with legacy API
import { defineCollection, z } from "astro:content";

const news = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/assets/data/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

const services = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/assets/data/services",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/assets/data/blogs" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: z.object({
        url: image(),
        alt: z.string(),
      }).optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { news, services, blogs };

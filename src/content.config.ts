import { glob } from 'astro/loaders'; // Not available with legacy API
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/assets/data/blog" }),
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
  })
});

export const collections = { blog };
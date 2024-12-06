import { z, defineCollection } from "astro:content"
import { glob, file } from "astro/loaders"
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
})

const galleriesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/galleries" }),
  schema: z.object({
    images: z.array(
      z.object({
        src: z.string().url(), // Validate as a URL
        alt: z.string(),
        title: z.string().optional(), // Optional title
        description: z.string().optional(), // Optional description
      })
    ),
  }),
})

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog: postsCollection,
  galleries: galleriesCollection,
}

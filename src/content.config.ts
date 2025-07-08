import { z, defineCollection } from "astro:content"

// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: "content", // For Markdown/MDX/Markdoc files in src/content/
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    lastUpdatedDate: z.date().optional(),
    description: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
})

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog: postsCollection,
}

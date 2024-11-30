// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content"
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: "content",
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
  type: "data",
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
  posts: postsCollection,
  galleries: galleriesCollection,
}

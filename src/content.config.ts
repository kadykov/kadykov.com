import { z, defineCollection } from "astro:content"

// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: "content", // For Markdown/MDX files in src/content/
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

const galleriesCollection = defineCollection({
  type: "data", // For JSON/YAML files in src/content/
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
// Note: If galleries are also to be moved to src/content/galleries,
// the loader would be removed and type: "data" would be used.
// For now, only modifying postsCollection as per immediate plan.

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog: postsCollection,
  galleries: galleriesCollection,
}

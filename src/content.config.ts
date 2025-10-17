import { z, defineCollection } from "astro:content"

// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: "content", // For Markdown/MDX/Markdoc files in src/content/
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
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

// Collection for static pages (About, Privacy Policy, etc.)
const pagesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
  }),
})

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog: postsCollection,
  pages: pagesCollection,
}

import { z, defineCollection } from "astro:content"
import { MANIFEST_URL } from "./config/photoServer"

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

// Photos data collection - fetches from remote manifest at build time
const photosCollection = defineCollection({
  loader: async () => {
    console.log("Fetching photo manifest from:", MANIFEST_URL)

    try {
      const response = await fetch(MANIFEST_URL)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch manifest from ${MANIFEST_URL}: ${response.statusText} (status ${response.status})`
        )
      }

      const jsonData = await response.json()
      console.log(`Loaded ${jsonData.length} photos from manifest`)

      // Return entries with id and data
      // The slug field is used as the unique id for each photo
      return jsonData.map((photo: any) => ({
        id: photo.slug,
        ...photo,
      }))
    } catch (error) {
      console.error("Failed to load photo manifest:", error)
      throw error
    }
  },
  schema: z.object({
    relativePath: z
      .string()
      .regex(
        /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[^/]+$/,
        "Invalid relativePath format"
      ),
    filename: z.string(),
    year: z.number().int().min(1900).max(2100).nullable(),
    month: z.number().int().min(1).max(12).nullable(),
    day: z.number().int().min(1).max(31).nullable(),
    width: z.number().int().min(1),
    height: z.number().int().min(1),
    dateTaken: z.preprocess(
      (val) => (val === "" ? null : val),
      z
        .string({
          invalid_type_error:
            "dateTaken must be a string or null (or an empty string which is converted to null).",
        })
        .refine(
          (str) => {
            const date = new globalThis.Date(str)
            return !isNaN(date.getTime())
          },
          {
            message:
              "dateTaken string is not a valid parsable date by new Date() or results in NaN.",
          }
        )
        .nullable()
    ),
    title: z.string().nullable(),
    description: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
    cameraModel: z.string().nullable(),
    lensModel: z.string().nullable(),
    flash: z.boolean().nullable(),
    focalLength: z.number().nullable(),
    focalLength35mmEquiv: z.number().int().nullable(),
    focalLengthCategory: z
      .enum([
        "ultra-wide",
        "wide",
        "normal",
        "short-telephoto",
        "telephoto",
        "super-telephoto",
      ])
      .nullable(),
    cropFactor: z.number().nullable(),
    apertureValue: z.number().nullable(),
    isoSpeedRatings: z
      .union([z.number().int(), z.array(z.number().int())])
      .nullable(),
    exposureTime: z.number().nullable(),
    creator: z.string().nullable(),
    copyright: z.string().nullable(),
    notes: z.string().nullable(),
    slug: z.string(),
  }),
})

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog: postsCollection,
  pages: pagesCollection,
  photos: photosCollection,
}

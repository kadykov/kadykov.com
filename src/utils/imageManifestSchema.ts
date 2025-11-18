import { z } from "astro/zod"

export const imageManifestItemSchema = z.object({
  relativePath: z.string(),
  filename: z.string(),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
  slug: z.string(),
  fileSize: z.number().int().nullable(),
  lastModified: z
    .string()
    .refine(
      (str) => {
        const date = new globalThis.Date(str)
        return !isNaN(date.getTime())
      },
      {
        message:
          "lastModified string is not a valid parsable date by new Date() or results in NaN.",
      }
    )
    .nullable(),
})

export const imageManifestSchema = z.array(imageManifestItemSchema)

export type ImageManifestItem = z.infer<typeof imageManifestItemSchema>
export type ImageManifest = z.infer<typeof imageManifestSchema>

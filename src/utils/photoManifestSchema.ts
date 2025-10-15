import { z } from "astro/zod"

export const photoManifestItemSchema = z.object({
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
    (val) => (val === "" ? null : val), // Step 1: Convert empty string to null
    z
      .string({
        // Ensure it's a string if not null
        invalid_type_error:
          "dateTaken must be a string or null (or an empty string which is converted to null).",
      })
      .refine(
        (str) => {
          // Step 2: If it's a string, validate with new Date()
          // This refine is only called if 'str' is a string.
          const date = new globalThis.Date(str)
          return !isNaN(date.getTime())
        },
        {
          message:
            "dateTaken string is not a valid parsable date by new Date() or results in NaN.",
        }
      )
      .nullable() // Step 3: Allow null (from preprocess or original data)
  ),
  title: z.string().nullable(),
  description: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  cameraModel: z.string().nullable(),
  lensModel: z.string().nullable(),
  flash: z.boolean().nullable(),
  focalLength: z.number().nullable(),
  apertureValue: z.number().nullable(),
  // Assuming isoSpeedRatings from example manifest is a single integer.
  // If it can truly be an array, this needs adjustment: z.union([z.number().int(), z.array(z.number().int())]).nullable()
  isoSpeedRatings: z.number().int().nullable(),
  exposureTime: z.number().nullable(),
  creator: z.string().nullable(),
  copyright: z.string().nullable(),
  slug: z.string(), // Slug is now a required string
})

export const photoManifestSchema = z.array(photoManifestItemSchema)

export type PhotoManifestItem = z.infer<typeof photoManifestItemSchema>
export type PhotoManifest = z.infer<typeof photoManifestSchema>

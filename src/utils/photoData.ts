import {
  photoManifestSchema,
  type PhotoManifestItem,
} from "./photoManifestSchema"
import { MANIFEST_URL } from "../config/photoServer"

const manifestUrl = MANIFEST_URL

let cachedManifest: PhotoManifestItem[] | null = null
let fetchPromise: Promise<PhotoManifestItem[]> | null = null

/**
 * Fetches, parses, and validates the photo manifest.
 * Implements in-memory caching to avoid multiple fetches during a single build process.
 * @returns A promise that resolves to an array of PhotoManifestItem.
 * @throws Error if fetching or parsing fails.
 */
export async function fetchPhotoManifest(): Promise<PhotoManifestItem[]> {
  if (cachedManifest) {
    return cachedManifest
  }

  if (fetchPromise) {
    return fetchPromise
  }

  fetchPromise = (async () => {
    try {
      console.log("Fetching photo manifest...") // Log to see how often it's called
      const response = await fetch(manifestUrl)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch manifest from ${manifestUrl}: ${response.statusText} (status ${response.status})`
        )
      }
      const jsonData = await response.json()
      const parsed = photoManifestSchema.safeParse(jsonData)

      if (!parsed.success) {
        console.error("Failed to parse photo manifest:", parsed.error.flatten())
        throw new Error(
          "Failed to parse photo manifest: " + parsed.error.toString()
        )
      }

      cachedManifest = parsed.data
      return cachedManifest
    } catch (error) {
      // Ensure fetchPromise is cleared on error so subsequent calls can retry
      fetchPromise = null
      // Re-throw the error to be handled by the caller
      if (error instanceof Error) {
        console.error(`Error in fetchPhotoManifest: ${error.message}`)
        throw error
      } else {
        console.error("An unknown error occurred in fetchPhotoManifest")
        throw new Error(
          "An unknown error occurred while fetching photo manifest."
        )
      }
    } finally {
      // Clear the promise lock once resolved or rejected, unless it resolved to cache.
      // If it cached, future calls hit the cache. If it failed, fetchPromise is already null.
      // This simple caching assumes the manifest doesn't change *during a single build*.
    }
  })()

  return fetchPromise
}

/**
 * Generates a URL-friendly slug from a photo's relativePath.
 * e.g., "2023/01/01/some-image.jpg" becomes "2023-01-01-some-image"
 * @param relativePath The relativePath string (e.g., "YYYY/MM/DD/filename.ext")
 * @returns The generated slug string.
 */
export function generateSlugFromRelativePath(relativePath: string): string {
  const parts = relativePath.split("/")
  if (parts.length === 4) {
    // Expected: YYYY/MM/DD/filename.ext
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    const filenameWithExt = parts[3]
    // Remove extension: "filename.jpg" -> "filename"
    const filenameWithoutExt =
      filenameWithExt.substring(0, filenameWithExt.lastIndexOf(".")) ||
      filenameWithExt
    return `${year}-${month}-${day}-${filenameWithoutExt}`
  }
  // Fallback for unexpected format. This should ideally not be reached if schema validation is robust.
  // Creates a slug by replacing slashes and dots with hyphens.
  console.warn(
    `Unexpected relativePath format for slug generation: "${relativePath}". Using fallback slug.`
  )
  const filenameWithoutExt =
    relativePath.substring(
      relativePath.lastIndexOf("/") + 1,
      relativePath.lastIndexOf(".")
    ) || relativePath.substring(relativePath.lastIndexOf("/") + 1)
  return filenameWithoutExt.replace(/[\/\.]/g, "-")
}

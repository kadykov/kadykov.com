import {
  imageManifestSchema,
  type ImageManifestItem,
} from "./imageManifestSchema"
import { IMAGE_MANIFEST_URL } from "../config/photoServer"

const manifestUrl = IMAGE_MANIFEST_URL

let cachedManifest: ImageManifestItem[] | null = null
let fetchPromise: Promise<ImageManifestItem[]> | null = null

/**
 * Fetches, parses, and validates the image manifest.
 * Implements in-memory caching to avoid multiple fetches during a single build process.
 * @returns A promise that resolves to an array of ImageManifestItem.
 * @throws Error if fetching or parsing fails.
 */
export async function fetchImageManifest(): Promise<ImageManifestItem[]> {
  if (cachedManifest) {
    return cachedManifest
  }

  if (fetchPromise) {
    return fetchPromise
  }

  fetchPromise = (async () => {
    try {
      console.log("Fetching image manifest...") // Log to see how often it's called
      const response = await fetch(manifestUrl)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch manifest from ${manifestUrl}: ${response.statusText} (status ${response.status})`
        )
      }
      const jsonData = await response.json()
      const parsed = imageManifestSchema.safeParse(jsonData)

      if (!parsed.success) {
        console.error("Failed to parse image manifest:", parsed.error.flatten())
        throw new Error(
          "Failed to parse image manifest: " + parsed.error.toString()
        )
      }

      cachedManifest = parsed.data
      return cachedManifest
    } catch (error) {
      // Ensure fetchPromise is cleared on error so subsequent calls can retry
      fetchPromise = null
      // Re-throw the error to be handled by the caller
      if (error instanceof Error) {
        console.error(`Error in fetchImageManifest: ${error.message}`)
        throw error
      } else {
        console.error("An unknown error occurred in fetchImageManifest")
        throw new Error(
          "An unknown error occurred while fetching image manifest."
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

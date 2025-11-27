/**
 * Manifest Lookup Utility
 *
 * Provides dimension lookup for remote images by checking against
 * the images and photos manifests. This avoids expensive remote fetches
 * during build time when the image is already cataloged.
 *
 * The lookup normalizes URLs by extracting the relative path, making it
 * work regardless of whether the URL uses production or local server.
 */

import { fetchImageManifest } from "./imageData"
import { fetchPhotoManifest } from "./photoData"
import { PHOTO_SERVER_URL } from "../config/photoServer"

export interface ImageDimensions {
  width: number
  height: number
}

// Cache for the lookup map (built once per build)
let lookupCache: Map<string, ImageDimensions> | null = null
let buildPromise: Promise<Map<string, ImageDimensions>> | null = null

/**
 * Extracts the relative path from a full URL.
 * Handles both production URLs (share.kadykov.com) and local dev URLs.
 *
 * @example
 * extractRelativePath("https://share.kadykov.com/images/blog/post/image.png")
 * // Returns: "images/blog/post/image.png"
 *
 * extractRelativePath("http://localhost:8000/photos/2024/01/01/photo.jpg")
 * // Returns: "photos/2024/01/01/photo.jpg"
 */
function extractRelativePath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Remove leading slash from pathname
    return urlObj.pathname.replace(/^\//, "")
  } catch {
    // Not a valid URL, might already be a relative path
    return url.replace(/^\//, "")
  }
}

/**
 * Builds the lookup cache from both image and photo manifests.
 * Uses relative paths as keys for environment-agnostic matching.
 */
async function buildLookupCache(): Promise<Map<string, ImageDimensions>> {
  const cache = new Map<string, ImageDimensions>()

  try {
    // Fetch both manifests in parallel
    const [images, photos] = await Promise.all([
      fetchImageManifest().catch((err) => {
        console.warn("Failed to fetch image manifest for lookup:", err.message)
        return []
      }),
      fetchPhotoManifest().catch((err) => {
        console.warn("Failed to fetch photo manifest for lookup:", err.message)
        return []
      }),
    ])

    // Add images to cache (keyed by relative path)
    for (const img of images) {
      cache.set(img.relativePath, {
        width: img.width,
        height: img.height,
      })
    }

    // Add photos to cache (keyed by relative path)
    for (const photo of photos) {
      cache.set(photo.relativePath, {
        width: photo.width,
        height: photo.height,
      })
    }

    console.log(
      `Manifest lookup cache built: ${images.length} images, ${photos.length} photos`
    )
  } catch (error) {
    console.error("Error building manifest lookup cache:", error)
  }

  return cache
}

/**
 * Looks up image dimensions from the combined images/photos manifest.
 *
 * This function checks if a URL corresponds to an image in either the
 * images or photos manifest and returns its dimensions if found.
 *
 * The lookup is environment-agnostic: it extracts the relative path from
 * the URL and matches against manifest entries, so it works whether you're
 * using production URLs (share.kadykov.com) or local dev URLs.
 *
 * @param url - The full image URL to look up
 * @returns Dimensions if found in manifest, undefined otherwise
 *
 * @example
 * const dims = await lookupDimensionsFromManifest(
 *   "https://share.kadykov.com/images/blog/post/screenshot.png"
 * )
 * // Returns: { width: 1920, height: 1080 } if in manifest
 * // Returns: undefined if not found
 */
export async function lookupDimensionsFromManifest(
  url: string
): Promise<ImageDimensions | undefined> {
  // Build cache on first call (singleton pattern with promise deduplication)
  if (!lookupCache) {
    if (!buildPromise) {
      buildPromise = buildLookupCache()
    }
    lookupCache = await buildPromise
  }

  // Extract relative path from the URL
  const relativePath = extractRelativePath(url)
  if (!relativePath) {
    return undefined
  }

  // Look up in cache
  return lookupCache.get(relativePath)
}

/**
 * Checks if a URL points to our photo server (production or local).
 * This helps determine if manifest lookup should be attempted.
 *
 * @param url - The URL to check
 * @returns true if the URL is from our photo server
 */
export function isPhotoServerUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const serverUrlObj = new URL(PHOTO_SERVER_URL)

    // Check if it's the configured photo server
    if (urlObj.host === serverUrlObj.host) {
      return true
    }

    // Also check for production URL in case local dev uses different server
    // but content has hardcoded production URLs
    if (urlObj.host === "share.kadykov.com") {
      return true
    }

    return false
  } catch {
    return false
  }
}

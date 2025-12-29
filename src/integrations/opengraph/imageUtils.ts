/**
 * Image Utilities for OpenGraph Generation
 *
 * Handles loading and converting optimized images from the dist folder
 * for embedding in Satori-generated OG images.
 */

import path from "node:path"
import sharp from "sharp"
import { decodeHtmlEntities } from "./utils"

/**
 * Parsed srcset entry
 */
interface SrcsetEntry {
  path: string // e.g., "/_astro/DSC_1244_1OI3Ad.avif"
  width: number // e.g., 350
}

/**
 * Parse a srcset string into entries
 */
export function parseSrcset(srcset: string): SrcsetEntry[] {
  const entries: SrcsetEntry[] = []

  // Match patterns like "/_astro/file.avif 350w"
  const regex = /(\/[^\s,]+)\s+(\d+)w/g
  let match

  while ((match = regex.exec(srcset)) !== null) {
    entries.push({
      path: match[1],
      width: parseInt(match[2], 10),
    })
  }

  return entries.sort((a, b) => a.width - b.width)
}

/**
 * Find the best image from srcset for OG embedding
 * Prefers images around 400-500px wide for good quality/size balance
 */
export function selectBestImage(
  entries: SrcsetEntry[],
  targetWidth: number = 450
): SrcsetEntry | null {
  if (entries.length === 0) return null

  // Find the smallest image that's >= targetWidth, or the largest available
  const suitable = entries.find((e) => e.width >= targetWidth)
  return suitable || entries[entries.length - 1]
}

/**
 * Extract srcset from HTML content
 * Looks for the main photo image in photo pages
 */
export function extractPhotoSrcset(html: string): string | null {
  // Look for <figure id="photo"> ... <img ... srcset="...">
  // or just the first img with srcset in a photo page
  const srcsetMatch = html.match(
    /<figure[^>]*id=["']?photo["']?[^>]*>[\s\S]*?<img[^>]*srcset=["']([^"']+)["']/
  )

  if (srcsetMatch) {
    return srcsetMatch[1]
  }

  // Fallback: look for any img with srcset containing _astro
  const fallbackMatch = html.match(
    /<img[^>]*srcset=["']([^"']*\/_astro\/[^"']+)["']/
  )
  return fallbackMatch?.[1] || null
}

/**
 * Load an optimized image from dist and convert to base64 JPEG data URL
 *
 * @param distDir - The dist directory path
 * @param imagePath - The image path from srcset (e.g., "/_astro/file.avif")
 * @param maxDimension - Optional: resize to fit within this dimension
 */
export async function loadImageAsDataUrl(
  distDir: string,
  imagePath: string,
  maxDimension?: number
): Promise<string> {
  // Convert URL path to filesystem path
  const fsPath = path.join(distDir, imagePath)

  // Read and convert to JPEG
  let pipeline = sharp(fsPath)

  // Optionally resize
  if (maxDimension) {
    pipeline = pipeline.resize(maxDimension, maxDimension, {
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  const buffer = await pipeline.jpeg({ quality: 85 }).toBuffer()

  // Convert to base64 data URL
  const base64 = buffer.toString("base64")
  return `data:image/jpeg;base64,${base64}`
}

/**
 * Extract photo metadata from HTML for OG image generation
 */
export interface PhotoMetadata {
  title: string
  description: string
  srcset: string
  width: number
  height: number
  dateTaken?: string
  tags?: string[]
}

/**
 * Extract photo-specific metadata from HTML
 */
export function extractPhotoMetadata(html: string): PhotoMetadata | null {
  const srcset = extractPhotoSrcset(html)
  if (!srcset) return null

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  let title = titleMatch?.[1] || ""
  title = title.replace(/ \| kadykov\.com$/, "")
  title = decodeHtmlEntities(title)

  // Extract description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)
  const description = decodeHtmlEntities(descMatch?.[1] || "")

  // Extract image dimensions from the img tag
  const widthMatch = html.match(/<img[^>]*width=(\d+)/)
  const heightMatch = html.match(/<img[^>]*height=(\d+)/)
  const width = widthMatch ? parseInt(widthMatch[1], 10) : 1
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 1

  // Extract date from the page content if available
  // Look for date in figcaption or data attributes
  const dateMatch = html.match(/Date taken<\/dt><dd><a[^>]*>([^<]+)<\/a>/)
  const dateTaken = dateMatch?.[1]
    ? decodeHtmlEntities(dateMatch[1])
    : undefined

  // Extract tags
  const tagMatches = html.matchAll(
    /<a[^>]*href="\/photos\/tags\/[^"]+">([^<]+)<\/a>/g
  )
  const tags = Array.from(tagMatches, (m) =>
    decodeHtmlEntities(m[1].replace(/^#/, ""))
  )

  return {
    title,
    description,
    srcset,
    width,
    height,
    dateTaken,
    tags: tags.length > 0 ? tags : undefined,
  }
}

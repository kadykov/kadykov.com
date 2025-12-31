/**
 * Image Utilities for OpenGraph Generation
 *
 * Handles loading and converting optimized images from the dist folder
 * for embedding in Satori-generated OG images.
 *
 * For photo pages, we skip Satori entirely and use Sharp directly to:
 * 1. Decide whether to fit or smart-crop based on aspect ratio
 * 2. Composite the photo onto a white canvas at OG dimensions
 * 3. Output as JPEG for smaller file sizes
 */

import path from "node:path"
import sharp from "sharp"
import { decodeHtmlEntities } from "./utils"

// OG Image dimensions
export const OG_WIDTH = 1200
const OG_HEIGHT = 630

/**
 * Threshold aspect ratio for cropping.
 *
 * Photos with aspect ratio below this threshold will be cropped TO this ratio.
 * This creates a unified approach: the threshold IS the crop target.
 *
 * For example, with THRESHOLD_ASPECT_RATIO = 1.0 (square):
 * - A 2:3 portrait (aspect 0.67) will be cropped to 1:1 (square)
 * - A 3:4 portrait (aspect 0.75) will be cropped to 1:1 (square)
 * - A 3:2 landscape (aspect 1.5) will NOT be cropped (already above threshold)
 *
 * A value of 1.0 (square) is a good balance:
 * - Square images fill ~53% of the OG canvas area
 * - Prevents very narrow portrait strips while preserving content
 */
const THRESHOLD_ASPECT_RATIO = 1.0 // Square

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

/**
 * Determine the processing strategy for a photo based on its aspect ratio.
 *
 * Uses a simple threshold: if the image aspect ratio is below THRESHOLD_ASPECT_RATIO,
 * crop it to that ratio. Otherwise, fit it as-is.
 */
type ProcessingStrategy =
  | { type: "fit" } // Fit the image as-is onto the canvas
  | { type: "crop"; targetAspectRatio: number } // Smart crop to target aspect ratio, then fit

function determineStrategy(
  imageWidth: number,
  imageHeight: number
): ProcessingStrategy {
  const imageAspect = imageWidth / imageHeight

  if (imageAspect >= THRESHOLD_ASPECT_RATIO) {
    // Image is wide enough (landscape or square-ish), fit as-is
    return { type: "fit" }
  }

  // Image is too tall (portrait), crop to threshold aspect ratio
  return { type: "crop", targetAspectRatio: THRESHOLD_ASPECT_RATIO }
}

/**
 * Generate a photo OG image directly using Sharp (no Satori)
 *
 * This is more efficient for photos and gives us full control over
 * the image processing pipeline.
 *
 * Strategy:
 * - Landscape/square photos (aspect >= threshold): Fit to canvas, center, white borders
 * - Portrait photos (aspect < threshold): Smart crop to threshold ratio, then fit and center
 *
 * @param distDir - The dist directory path
 * @param imagePath - The image path from srcset (e.g., "/_astro/file.avif")
 * @returns JPEG buffer of the OG image
 */
export async function generatePhotoOGImage(
  distDir: string,
  imagePath: string
): Promise<Buffer> {
  const fsPath = path.join(distDir, imagePath)

  // Get image metadata to determine strategy
  const metadata = await sharp(fsPath).metadata()
  const imageWidth = metadata.width || 1
  const imageHeight = metadata.height || 1

  const strategy = determineStrategy(imageWidth, imageHeight)

  // Step 1: Optionally crop the image
  // Note: We must execute crop to buffer first, then resize separately,
  // because chaining multiple .resize() calls only applies the last one.
  let imageToFit: Buffer

  if (strategy.type === "crop") {
    // Smart crop to target aspect ratio using attention strategy
    // This focuses on regions with high luminance, saturation, and skin tones
    const targetWidth = Math.round(imageHeight * strategy.targetAspectRatio)

    if (targetWidth <= imageWidth) {
      // Need to crop width (make narrower) - typical for very tall portraits
      imageToFit = await sharp(fsPath)
        .resize(targetWidth, imageHeight, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .toBuffer()
    } else {
      // Need to crop height (make shorter) - more common for moderately tall portraits
      const targetHeight = Math.round(imageWidth / strategy.targetAspectRatio)
      imageToFit = await sharp(fsPath)
        .resize(imageWidth, targetHeight, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .toBuffer()
    }
  } else {
    // No cropping needed, load the original image
    imageToFit = await sharp(fsPath).toBuffer()
  }

  // Step 2: Resize to fit within OG dimensions (maintaining aspect ratio)
  const resizedBuffer = await sharp(imageToFit)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer()

  const resizedMeta = await sharp(resizedBuffer).metadata()
  const resizedWidth = resizedMeta.width || OG_WIDTH
  const resizedHeight = resizedMeta.height || OG_HEIGHT

  // Calculate centering offsets
  const left = Math.round((OG_WIDTH - resizedWidth) / 2)
  const top = Math.round((OG_HEIGHT - resizedHeight) / 2)

  // Step 3: Create white canvas and composite the photo centered
  const finalImage = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: resizedBuffer,
        left,
        top,
      },
    ])
    .jpeg({
      quality: 70, // Good quality/size balance for photos
      // chromaSubsampling: "4:4:4", // Better color fidelity
      mozjpeg: true, // Use mozjpeg for better compression
    })
    .toBuffer()

  return finalImage
}

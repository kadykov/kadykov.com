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
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_ASPECT_RATIO = OG_WIDTH / OG_HEIGHT // ~1.9:1

/**
 * Minimum area ratio threshold for deciding fit vs crop.
 * If the fitted photo would occupy less than this ratio of the OG canvas,
 * we apply smart cropping to make better use of space.
 *
 * 0.45 means: if photo would be less than 45% of canvas area, crop it.
 */
const MIN_AREA_RATIO = 0.45

/**
 * Target aspect ratio for cropping portrait photos.
 * We don't crop all the way to OG_ASPECT_RATIO (1.9:1) as that's too aggressive.
 * Instead, we crop to a moderate ratio that balances space usage with content preservation.
 */
const CROP_TARGET_ASPECT_RATIO = 4 / 3 // 1.33:1

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
 * Calculate what percentage of the OG canvas a fitted image would occupy
 */
function calculateAreaRatio(imageWidth: number, imageHeight: number): number {
  const imageAspect = imageWidth / imageHeight

  let fittedWidth: number
  let fittedHeight: number

  if (imageAspect >= OG_ASPECT_RATIO) {
    // Image is wider than OG canvas - fit by width
    fittedWidth = OG_WIDTH
    fittedHeight = OG_WIDTH / imageAspect
  } else {
    // Image is taller than OG canvas - fit by height
    fittedHeight = OG_HEIGHT
    fittedWidth = OG_HEIGHT * imageAspect
  }

  const fittedArea = fittedWidth * fittedHeight
  const canvasArea = OG_WIDTH * OG_HEIGHT
  return fittedArea / canvasArea
}

/**
 * Determine the processing strategy for a photo
 */
type ProcessingStrategy =
  | { type: "fit" } // Fit the image as-is onto the canvas
  | { type: "crop"; targetAspectRatio: number } // Smart crop to target aspect ratio, then fit

function determineStrategy(
  imageWidth: number,
  imageHeight: number
): ProcessingStrategy {
  const areaRatio = calculateAreaRatio(imageWidth, imageHeight)

  if (areaRatio >= MIN_AREA_RATIO) {
    // Image fills enough of the canvas when fitted
    return { type: "fit" }
  }

  // Image would be too small - crop it to fill more space
  // Use a moderate target aspect ratio to preserve content
  return { type: "crop", targetAspectRatio: CROP_TARGET_ASPECT_RATIO }
}

/**
 * Generate a photo OG image directly using Sharp (no Satori)
 *
 * This is more efficient for photos and gives us full control over
 * the image processing pipeline.
 *
 * Strategy:
 * - Landscape/wide photos: Fit to canvas, center, white borders on sides
 * - Portrait/square photos: Smart crop to 4:3, then fit and center
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

  let processedImage: sharp.Sharp

  if (strategy.type === "crop") {
    // Smart crop to target aspect ratio using attention strategy
    // This focuses on regions with high luminance, saturation, and skin tones
    const targetWidth = Math.round(imageHeight * strategy.targetAspectRatio)

    if (targetWidth <= imageWidth) {
      // Need to crop width (make narrower) - typical for very tall portraits
      processedImage = sharp(fsPath).resize(targetWidth, imageHeight, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
    } else {
      // Need to crop height (make shorter) - atypical but handle it
      const targetHeight = Math.round(imageWidth / strategy.targetAspectRatio)
      processedImage = sharp(fsPath).resize(imageWidth, targetHeight, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
    }
  } else {
    // Fit strategy: just load the image as-is
    processedImage = sharp(fsPath)
  }

  // Sharp's extend doesn't center automatically, so we need to composite instead
  // Create a white canvas and composite the resized image centered on it
  const resizedBuffer = await processedImage
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

  // Create white canvas and composite the photo centered
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
    .jpeg({ quality: 85 })
    .toBuffer()

  return finalImage
}

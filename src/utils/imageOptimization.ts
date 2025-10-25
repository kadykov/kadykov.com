/**
 * Image Optimization Utility
 *
 * Centralized image processing to ensure cache sharing across all components.
 * Uses Astro's getImage() with inferSize to maintain perfect aspect ratios.
 *
 * Key principles:
 * - Always use inferSize: true (no explicit width/height)
 * - Always use layout: "constrained" for responsive images
 * - Always use same format (AVIF)
 * - Use maxWidth to control automatic DPR-aware srcset generation
 *
 * This ensures that PhotoGallery, OptimizedImage, and MarkdocImage all generate
 * identical cached images that can be reused.
 */

import { getImage, inferRemoteSize } from "astro:assets"

export interface OptimizedImageConfig {
  src: string
  width?: number // Original image width - if provided, skips inferSize
  height?: number // Original image height - if provided, skips inferSize
  maxWidth?: number // Maximum display width (1x DPR) - will generate up to 4x for high-DPI
  originalWidth?: number // Original image width - used to prevent requesting widths larger than source
  quality?: number // Image quality (default: Astro's default)
  layout?: "constrained" | "full-width" // Layout type (default: "constrained")
}

export interface OptimizedImageResult {
  src: string // Primary src (smallest image in srcset)
  srcset: string // Complete srcset attribute value
  width?: number // Intrinsic width of the src image
  height?: number // Intrinsic height of the src image
}

/**
 * Standard responsive widths for image srcset generation.
 *
 * These widths are chosen to cover common device sizes with ~1.2x increments,
 * while avoiding excessive numbers of variants.
 *
 * They range from small thumbnails (200w) to large 6K displays (6144w).
 */
const STANDARD_WIDTHS = [
  200, 240, 288, 350, 420, 500, 600, 720, 900, 1080, 1280, 1600, 1920, 2400,
  2880, 3500, 4096, 5120, 6144,
]

/**
 * Filter widths to include only those suitable for a given display width
 * considering device pixel ratio (DPR) from 1x to 4x.
 *
 * This prevents generating unnecessary large images while ensuring
 * high-DPI displays get sharp images. Targeting 4x DPR ensures proper
 * coverage for 3x DPR devices and provides future-proofing.
 *
 * @param displayWidth - The CSS display width (at 1x DPR)
 * @param availableWidths - Array of available image widths
 * @returns Filtered array of widths suitable for 1x-4x DPR
 *
 * @example
 * filterWidthsForDisplay(198, STANDARD_WIDTHS)
 * // Returns widths between 198 (1x) and 792 (4x): [240, 288, 350, 420, 500, 600, 720]
 */
function filterWidthsForDisplay(
  displayWidth: number,
  availableWidths: number[]
): number[] {
  const minWidth = displayWidth // 1x DPR
  const maxWidth = displayWidth * 4 // 4x DPR (ensures 3x coverage + future-proofing)

  // Filter widths that fall within the DPR range
  const filtered = availableWidths.filter((w) => w >= minWidth && w <= maxWidth)

  // Safety fallback: ensure we have at least one width if filtering was too restrictive
  if (filtered.length === 0) {
    const closestAbove = availableWidths.find((w) => w >= minWidth)
    if (closestAbove) filtered.push(closestAbove)
  }

  return Array.from(new Set(filtered)).sort((a, b) => a - b)
}

/**
 * Generate optimized AVIF images with responsive srcset.
 *
 * This is the single source of truth for image optimization across the site.
 * All components should use this function to ensure cache sharing.
 *
 * @param config - Image optimization configuration
 * @returns Optimized image data (src, srcset, dimensions)
 *
 * @example
 * // For photo gallery thumbnails (auto-filters to 1x-4x DPR)
 * const thumbnail = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   maxWidth: 198 // Will generate suitable widths from 198w to ~792w
 * })
 *
 * @example
 * // For article images
 * const articleImage = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   maxWidth: 660
 * })
 *
 * @example
 * // For lightbox (full-width, no filtering)
 * const lightbox = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   layout: "full-width"
 * })
 */
export async function generateOptimizedImage(
  config: OptimizedImageConfig
): Promise<OptimizedImageResult> {
  const {
    src,
    width,
    height,
    maxWidth,
    originalWidth,
    quality,
    layout = "constrained",
  } = config

  try {
    // Determine the original image width for filtering purposes
    // Priority: width param > originalWidth param > infer from remote
    let imageOriginalWidth = width || originalWidth
    if (!imageOriginalWidth) {
      try {
        const dimensions = await inferRemoteSize(src)
        imageOriginalWidth = dimensions.width
      } catch (error) {
        console.warn(
          `Failed to infer dimensions for ${src}, proceeding without width filtering:`,
          error
        )
      }
    }

    // Build getImage parameters
    const imageParams: any = {
      src,
      format: "avif",
      layout,
      quality: 60, // Increase default quality
    }

    // If both width and height are provided, use them explicitly to avoid fetching the remote image
    // Otherwise, use inferSize which will fetch the image to get dimensions
    if (width && height) {
      imageParams.width = width
      imageParams.height = height
    } else {
      imageParams.inferSize = true // Falls back to inferring (requires fetching)
    }

    // Start with the appropriate width set based on layout and parameters
    let targetWidths: number[]

    if (layout === "full-width") {
      // Full-width: use full range of standard widths (no DPR filtering)
      targetWidths = STANDARD_WIDTHS
    } else if (maxWidth) {
      // Smart filtering: generate widths suitable for 1x-4x DPR
      targetWidths = filterWidthsForDisplay(maxWidth, STANDARD_WIDTHS)
    } else {
      // No constraints: use full standard width range
      targetWidths = STANDARD_WIDTHS
    }

    // CRITICAL: Filter out widths larger than the original image
    // This prevents Astro from generating duplicate full-resolution images
    // with different cache keys when requested width exceeds original size
    if (imageOriginalWidth) {
      targetWidths = targetWidths.filter((w) => w <= imageOriginalWidth)

      // For full-width layout (lightbox), ensure we include the original width
      // if it's not already in the array. This allows users to view images
      // at their native resolution.
      if (
        layout === "full-width" &&
        !targetWidths.includes(imageOriginalWidth)
      ) {
        targetWidths.push(imageOriginalWidth)
        targetWidths.sort((a, b) => a - b)
      }
    }

    imageParams.widths = targetWidths

    if (quality) {
      imageParams.quality = quality
    }

    // Generate the image
    const result = await getImage(imageParams)

    // Calculate display dimensions based on maxWidth (CSS display size)
    // These dimensions are used for layout before the image loads
    let displayWidth: number | undefined
    let displayHeight: number | undefined

    if (result.attributes?.width && result.attributes?.height) {
      const originalWidth = result.attributes.width
      const originalHeight = result.attributes.height
      const aspectRatio = originalHeight / originalWidth

      // Use maxWidth if provided (CSS display size)
      // Otherwise fall back to smallest srcset width
      if (maxWidth) {
        displayWidth = maxWidth
      } else if (imageParams.widths && imageParams.widths.length > 0) {
        displayWidth = Math.min(...imageParams.widths)
      } else {
        // If no widths specified, Astro generates default responsive widths
        // The smallest is typically 640w
        displayWidth = 640
      }

      // Calculate height maintaining aspect ratio
      displayHeight = Math.round(displayWidth * aspectRatio)
    }

    // Extract the smallest image URL from srcset
    // Astro's result.src might not be the smallest - it's often a default/middle size
    let smallestSrc = result.src
    const srcsetAttr = result.srcSet?.attribute || ""

    if (result.srcSet?.values && result.srcSet.values.length > 0) {
      // Use Astro's structured srcSet.values array instead of parsing
      // Each value has: { url: string, descriptor: string } where descriptor is like "640w"
      const srcsetValues = result.srcSet.values.map((entry: any) => {
        const widthMatch = entry.descriptor?.match(/^(\d+)w$/)
        const width = widthMatch ? parseInt(widthMatch[1], 10) : Infinity
        return { url: entry.url, width }
      })

      // Find the smallest width
      const smallest = srcsetValues.reduce((min, curr) =>
        curr.width < min.width ? curr : min
      )
      smallestSrc = smallest.url
    }

    return {
      src: smallestSrc, // Always return the smallest image from srcset
      srcset: srcsetAttr,
      width: displayWidth,
      height: displayHeight,
    }
  } catch (error) {
    console.error(`Failed to generate optimized image for ${src}:`, error)
    // Fallback to original image
    return {
      src,
      srcset: "",
    }
  }
}

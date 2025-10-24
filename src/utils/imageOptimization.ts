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
  maxWidth?: number // Maximum display width (1x DPR) - will generate up to 3x for high-DPI
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
 * considering device pixel ratio (DPR) from 1x to 3x.
 *
 * This prevents generating unnecessary large images while ensuring
 * high-DPI displays get sharp images.
 *
 * @param displayWidth - The CSS display width (at 1x DPR)
 * @param availableWidths - Array of available image widths
 * @returns Filtered array of widths suitable for 1x-3x DPR
 *
 * @example
 * filterWidthsForDisplay(198, STANDARD_WIDTHS)
 * // Returns widths between 198 (1x) and 594 (3x): [640]
 * // Note: 640 is closest available width for 2x DPR (396)
 */
function filterWidthsForDisplay(
  displayWidth: number,
  availableWidths: number[]
): number[] {
  const minWidth = displayWidth // 1x DPR
  const maxWidth = displayWidth * 3 // 3x DPR (high-end mobile)

  // Filter widths that fall within the DPR range
  const filtered = availableWidths.filter((w) => w >= minWidth && w <= maxWidth)

  // Always include at least the two closest widths to displayWidth
  // even if they're slightly outside the range
  if (filtered.length === 0) {
    // Find the closest width above displayWidth
    const closestAbove = availableWidths.find((w) => w >= minWidth)
    if (closestAbove) filtered.push(closestAbove)
  }

  // Ensure we have at least 2-3 widths for responsive behavior
  if (filtered.length < 2) {
    const closestAbove = availableWidths.filter((w) => w >= minWidth)
    filtered.push(...closestAbove.slice(0, 3 - filtered.length))
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
 * // For photo gallery thumbnails (auto-filters to 1x-3x DPR)
 * const thumbnail = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   maxWidth: 198 // Will generate ~198w, ~396w, ~594w from standard set
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
    maxWidth,
    originalWidth,
    quality,
    layout = "constrained",
  } = config

  try {
    // If originalWidth is not provided, infer it from the image source
    // This works for both local and remote images without triggering image processing
    let imageOriginalWidth = originalWidth
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
      inferSize: true, // Critical: maintains perfect aspect ratio and enables cache sharing
    }

    // Start with the appropriate width set based on layout and parameters
    let targetWidths: number[]

    if (layout === "full-width") {
      // Full-width: use full range of standard widths (no DPR filtering)
      targetWidths = STANDARD_WIDTHS
    } else if (maxWidth) {
      // Smart filtering: generate widths suitable for 1x-3x DPR
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

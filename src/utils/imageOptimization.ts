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
 * - Use widths parameter to control srcset generation
 *
 * This ensures that PhotoGallery, OptimizedImage, and MarkdocImage all generate
 * identical cached images that can be reused.
 */

import { getImage } from "astro:assets"

export interface OptimizedImageConfig {
  src: string
  maxWidth?: number // Maximum display width (1x DPR) - will generate up to 3x for high-DPI
  widths?: number[] // DEPRECATED: Use maxWidth instead for automatic DPR-aware filtering
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
 * Based on Astro's DEFAULT_RESOLUTIONS (astro/packages/astro/src/assets/layout.ts)
 * with additional smaller widths for vertical photo thumbnails at 1x DPR.
 *
 * These widths cover:
 * - 200-640: Vertical thumbnails and small images (1x DPR)
 * - 640-1280: Common phone screens (iPhone 6-8, XR/11, Plus models, 720p)
 * - 1668-2560: Tablets and laptops (iPads, 1080p, QXGA, WQXGA)
 * - 3200-6016: High-end displays (QHD+, 4K, 4.5K, 5K, 6K)
 *
 * Smaller images convert faster and are filtered automatically by maxWidth parameter.
 */
const STANDARD_WIDTHS = [
  200, // Vertical thumbnails with 1x DPR
  240,
  320,
  360,
  400, // Vertical thumbnails with 2x DPR
  480, // Small images and older phones
  640, // Older and lower-end phones
  750, // iPhone 6-8
  828, // iPhone XR/11
  960, // Older horizontal phones
  1080, // iPhone 6-8 Plus
  1280, // 720p
  1668, // Various iPads
  1920, // 1080p
  2048, // QXGA
  2560, // WQXGA
  3200, // QHD+
  3840, // 4K
  4480, // 4.5K
  5120, // 5K
  6016, // 6K
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

  return [...new Set(filtered)].sort((a, b) => a - b)
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
  const { src, maxWidth, widths, quality, layout = "constrained" } = config

  try {
    // Build getImage parameters
    const imageParams: any = {
      src,
      format: "avif",
      layout,
      inferSize: true, // Critical: maintains perfect aspect ratio and enables cache sharing
    }

    // Determine which widths to generate
    if (layout === "full-width") {
      // Full-width: use Astro's default responsive widths (no filtering)
      // Don't specify widths - let Astro generate the full range
    } else if (widths) {
      // Legacy support: if widths explicitly provided, use them as-is
      imageParams.widths = widths
    } else if (maxWidth) {
      // Smart filtering: generate widths suitable for 1x-3x DPR
      imageParams.widths = filterWidthsForDisplay(maxWidth, STANDARD_WIDTHS)
    }
    // else: no width constraints, use Astro's defaults

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

    return {
      src: result.src,
      srcset: result.srcSet?.attribute || "",
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

/**
 * Image Optimization Utility
 *
 * Centralized image processing to ensure cache sharing across all components.
 * Uses Astro's getImage() with inferSize to maintain perfect aspect ratios.
 *
 * Key principles:
 * - Always use inferSize: true (no explicit width/height) when source dimensions not provided
 * - Always use layout: "constrained" for responsive images (default)
 * - Always use same format (AVIF)
 * - Use maxWidth to control automatic DPR-aware srcset generation (1x to 4x)
 *
 * This ensures that PhotoGallery, OptimizedImage, and MarkdocImage all generate
 * identical cached images that can be reused.
 *
 * IMPORTANT: Understanding width/height in HTML images
 * ======================================================
 * The width and height attributes on <img> elements should be the CSS DISPLAY
 * dimensions (at 1x DPR), NOT the original image dimensions. This:
 *
 * 1. Prevents Cumulative Layout Shift (CLS) by reserving space
 * 2. Establishes the aspect ratio for responsive layouts
 * 3. Works correctly with srcset for high-DPI displays
 *
 * Example:
 *   <img src="photo-313w.avif"
 *        srcset="photo-313w.avif 313w, photo-626w.avif 626w, photo-1252w.avif 1252w"
 *        width="313"    <!-- CSS display width (1x DPR) -->
 *        height="235"   <!-- CSS display height (maintains aspect ratio) -->
 *        sizes="313px"
 *   />
 *
 * The browser will:
 * - Reserve 313×235px of space (preventing layout shift)
 * - Display the image at 313×235 CSS pixels
 * - Select photo-626w.avif on 2x DPR displays (Retina)
 * - Select photo-939w.avif on 3x DPR displays
 */

import { getImage, inferRemoteSize } from "astro:assets"
import type { ImageMetadata } from "astro"

export interface OptimizedImageConfig {
  src: ImageMetadata | string

  /**
   * SOURCE DIMENSIONS: Original image dimensions for performance optimization.
   * When provided together, skips remote image fetching to determine aspect ratio.
   * These are NOT used for HTML width/height attributes (see maxWidth instead).
   *
   * NOTE: For local images (ImageMetadata), dimensions are automatically extracted
   * from the image metadata, so these parameters are ignored.
   */
  width?: number
  height?: number
  /**
   * DISPLAY WIDTH: Maximum CSS display width in pixels (at 1x DPR).
   * This determines:
   * 1. The srcset widths generated (1x to 4x DPR automatically)
   * 2. The width/height returned for HTML attributes
   *
   * Example: maxWidth: 313 generates [313w, 350w, 420w, 500w, 600w, 720w, 900w, 1080w, 1252w]
   * (filtered to 1x-4x range: 313px-1252px)
   */
  maxWidth?: number

  /**
   * ORIGINAL WIDTH: Alternative name for width (for clarity in some contexts).
   * Prevents requesting srcset widths larger than the source image.
   */
  originalWidth?: number

  /** Image quality (default: 60 for AVIF) */
  quality?: number

  /** Layout type (default: "constrained" for responsive, "full-width" for lightbox) */
  layout?: "constrained" | "full-width"
}

export interface OptimizedImageResult {
  src: string // Primary src (smallest image in srcset)
  srcset: string // Complete srcset attribute value
  width?: number // CSS display width for HTML width attribute
  height?: number // CSS display height for HTML height attribute
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
 * @returns Optimized image data with CSS display dimensions for HTML attributes
 *
 * @example
 * // Photo gallery thumbnails (smart DPR filtering: 1x-4x)
 * const thumbnail = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   width: 3000,        // Source dimensions (avoids remote fetch)
 *   height: 2000,
 *   maxWidth: 313       // CSS display width → generates 313w to 1252w (4x DPR)
 * })
 * // Returns: { src: "photo-313w.avif", srcset: "...", width: 313, height: 235 }
 * // Use width/height for HTML attributes ✅
 *
 * @example
 * // Article images (medium display size)
 * const articleImage = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   maxWidth: 660      // CSS display width
 * })
 *
 * @example
 * // Lightbox (full-width, no DPR filtering)
 * const lightbox = await generateOptimizedImage({
 *   src: "https://example.com/photo.jpg",
 *   width: 3000,
 *   height: 2000,
 *   layout: "full-width"  // Generates full range of widths
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
    // Extract dimensions from ImageMetadata or use provided dimensions
    let imageOriginalWidth: number | undefined
    let imageOriginalHeight: number | undefined
    let imageSrc: string | ImageMetadata = src

    if (typeof src === "object" && "src" in src) {
      // Local image - ImageMetadata object
      // Keep the ImageMetadata object for getImage() to enable proper optimization
      // and prevent copying the original file to the build directory
      //
      // CRITICAL: Do NOT access ImageMetadata properties (src.width, src.height, src.src, etc.)
      // Accessing these properties causes Astro to create a reference to the original file
      // and copy it to the build directory, even if it's never used!
      //
      // For width filtering, dimensions must be passed explicitly via width/originalWidth parameters
      imageOriginalWidth = width || originalWidth
      imageOriginalHeight = height
      imageSrc = src // Pass ImageMetadata directly to getImage()
    } else {
      // Remote image - string URL
      imageOriginalWidth = width || originalWidth
      imageOriginalHeight = height
      imageSrc = src

      // Infer dimensions from remote image if not provided
      if (!imageOriginalWidth) {
        try {
          const dimensions = await inferRemoteSize(src)
          imageOriginalWidth = dimensions.width
          imageOriginalHeight = dimensions.height
        } catch (error) {
          console.warn(
            `Failed to infer dimensions for ${src}, proceeding without width filtering:`,
            error
          )
        }
      }
    }

    // Build getImage parameters
    const imageParams: any = {
      src: imageSrc, // ImageMetadata for local, string URL for remote
      format: "avif",
      layout,
      quality: quality ?? 60,
    }

    // For local images (ImageMetadata), don't set width/height explicitly
    // Let Astro handle dimensions automatically to ensure proper optimization
    if (typeof imageSrc === "string") {
      // For remote images, provide dimensions if available
      if (imageOriginalWidth && imageOriginalHeight) {
        imageParams.width = imageOriginalWidth
        imageParams.height = imageOriginalHeight
      } else {
        // Use inferSize for remote images without dimensions
        imageParams.inferSize = true
      }
    }
    // For ImageMetadata objects, Astro automatically knows the dimensions

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
      // Otherwise default to original image dimensions (full resolution)
      if (maxWidth) {
        displayWidth = maxWidth
        // Calculate height maintaining aspect ratio
        displayHeight = Math.round(displayWidth * aspectRatio)
      } else {
        // When maxWidth is not provided, use original dimensions
        // This allows the browser to reserve the correct space for the full-resolution image
        displayWidth = originalWidth
        displayHeight = originalHeight
      }
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
    const srcString = typeof src === "string" ? src : src.src
    console.error(`Failed to generate optimized image for ${srcString}:`, error)
    // Fallback to original image
    return {
      src: srcString,
      srcset: "",
    }
  }
}

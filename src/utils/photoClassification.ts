/**
 * Photo Classification Utility
 *
 * Implements a two-step classification system for photo gallery layout:
 * 1. Determines caption placement (bottom vs side)
 * 2. Determines grid span based on the resulting card aspect ratio
 *
 * The key insight is that caption placement affects the final card aspect ratio,
 * so we strategically place captions to push boundary aspect ratios toward their
 * intended grid layout, creating more coherent packing.
 */

export interface PhotoClassification {
  captionClass: "caption-bottom" | "caption-side"
  gridClass: "grid-landscape" | "grid-square" | "grid-portrait"
  description?: string
}

/**
 * Classifies a photo based on its aspect ratio using a two-step algorithm.
 *
 * @param width - The width of the photo in pixels
 * @param height - The height of the photo in pixels
 * @returns An object containing the caption and grid CSS classes
 *
 * @example
 * const classes = classifyPhoto(1600, 1200);
 * // returns { captionClass: 'caption-bottom', gridClass: 'grid-landscape' }
 */
export function classifyPhoto(
  width: number,
  height: number
): PhotoClassification {
  const ratio = width / height

  // Very landscape: caption bottom → card is landscape → grid landscape
  if (ratio >= 1.4) {
    return {
      captionClass: "caption-bottom",
      gridClass: "grid-landscape",
      description: "Very landscape: bottom caption → landscape grid",
    }
  }

  // Almost landscape (1.3-1.4): caption SIDE → card becomes MORE landscape → grid landscape
  if (ratio >= 1.3) {
    return {
      captionClass: "caption-side",
      gridClass: "grid-landscape",
      description:
        "Almost landscape: side caption → MORE landscape → landscape grid",
    }
  }

  // Square range (0.97-1.3): caption bottom → stays squarish → grid square
  // This also handles almost-landscape values (1.0-1.3) by making them more square
  if (ratio >= 0.97) {
    return {
      captionClass: "caption-bottom",
      gridClass: "grid-square",
      description: "Square range: bottom caption → square grid",
    }
  }

  // Upper almost-portrait (0.80-0.97): caption SIDE → keeps them MORE square → grid square
  // For values closer to square, we want to prevent them from becoming too portrait
  if (ratio >= 0.8) {
    return {
      captionClass: "caption-side",
      gridClass: "grid-square",
      description:
        "Upper almost-portrait: side caption → MORE square → square grid",
    }
  }

  // Lower almost-portrait (0.65-0.80): caption BOTTOM → makes them MORE portrait → grid portrait
  // For values closer to portrait, we want to push them toward portrait
  if (ratio >= 0.65) {
    return {
      captionClass: "caption-bottom",
      gridClass: "grid-portrait",
      description:
        "Lower almost-portrait: bottom caption → MORE portrait → portrait grid",
    }
  }

  // Very portrait: caption side → card is portrait → grid portrait
  return {
    captionClass: "caption-side",
    gridClass: "grid-portrait",
    description: "Very portrait: side caption → portrait grid",
  }
}

/**
 * Gets the combined CSS class string for a photo.
 * Convenience function that combines caption and grid classes.
 *
 * @param width - The width of the photo in pixels
 * @param height - The height of the photo in pixels
 * @returns A space-separated string of CSS classes
 *
 * @example
 * const classes = getPhotoClasses(1600, 1200);
 * // returns "caption-bottom grid-landscape"
 */
export function getPhotoClasses(width: number, height: number): string {
  const classification = classifyPhoto(width, height)
  return `${classification.captionClass} ${classification.gridClass}`
}

/**
 * Classification thresholds for documentation and testing purposes.
 * Update these values if you adjust the classification algorithm.
 */
export const CLASSIFICATION_THRESHOLDS = {
  veryLandscape: 1.4,
  almostLandscape: 1.3,
  squareRange: 0.97,
  upperAlmostPortrait: 0.8,
  lowerAlmostPortrait: 0.65,
} as const

/**
 * Gets a human-readable description of the classification ranges.
 * Useful for documentation and UI display.
 */
export function getClassificationRanges() {
  const t = CLASSIFICATION_THRESHOLDS
  return [
    {
      range: `≥${t.veryLandscape}`,
      caption: "Bottom",
      effect: "Stays landscape",
      grid: "Landscape (2×3)",
    },
    {
      range: `${t.almostLandscape}–${t.veryLandscape}`,
      caption: "Side",
      effect: "→ MORE landscape",
      grid: "Landscape (2×3)",
    },
    {
      range: `${t.squareRange}–${t.almostLandscape}`,
      caption: "Bottom",
      effect: "Stays square",
      grid: "Square (2×2)",
    },
    {
      range: `${t.upperAlmostPortrait}–${t.squareRange}`,
      caption: "Side",
      effect: "→ MORE square",
      grid: "Square (2×2)",
    },
    {
      range: `${t.lowerAlmostPortrait}–${t.upperAlmostPortrait}`,
      caption: "Bottom",
      effect: "→ MORE portrait",
      grid: "Portrait (3×2)",
    },
    {
      range: `<${t.lowerAlmostPortrait}`,
      caption: "Side",
      effect: "Stays portrait",
      grid: "Portrait (3×2)",
    },
  ]
}

/**
 * Grid layout constants from base.css
 * These define the physical dimensions of the grid system
 */
const GRID_CONSTANTS = {
  COLUMN_WIDTH_REM: 5, // Each grid column width
  GAP_REM: 1.5, // Gap between columns
  PADDING_NORMAL: 0.5, // Normal padding on each side
  PADDING_SIDE_CAPTION: 2, // Padding on the side where caption is placed
  // Rem to viewport conversion: 1rem = clamp(16px, 0.395vw + 14.42px, 22px)
  REM_TO_VW: 0.395,
  REM_TO_PX_BASE: 14.42,
  REM_MIN_PX: 16, // Minimum rem value in pixels (at narrow viewports)
  REM_MAX_PX: 22, // Maximum rem value in pixels (at wide viewports)
} as const

/**
 * Calculates optimal image dimensions for the grid layout
 * considering caption placement and grid span.
 *
 * The calculation accounts for:
 * - Grid columns and gaps
 * - Caption placement (side vs bottom affects padding)
 * - Responsive rem scaling (16px to 22px based on viewport)
 *
 * @param classification - The photo classification (from classifyPhoto)
 * @returns Object with displayWidth and sizesAttr for OptimizedImage
 *
 * @example
 * const classification = classifyPhoto(1600, 1200);
 * const { displayWidth, sizesAttr } = getImageDimensions(classification);
 * // displayWidth: 313 (at 1rem = 22px)
 * // sizesAttr: "clamp(228px, calc(19.16vw + 205.98px), 313px)"
 */
export function getImageDimensions(classification: PhotoClassification): {
  displayWidth: number
  sizesAttr: string
} {
  const {
    COLUMN_WIDTH_REM,
    GAP_REM,
    PADDING_NORMAL,
    PADDING_SIDE_CAPTION,
    REM_TO_VW,
    REM_TO_PX_BASE,
    REM_MIN_PX,
    REM_MAX_PX,
  } = GRID_CONSTANTS

  // Determine grid span and padding based on classification
  let columns: number
  let paddingLeft: number
  let paddingRight: number

  if (classification.gridClass === "grid-landscape") {
    // Landscape: 3 columns, caption at bottom (normal padding on both sides)
    columns = 3
    paddingLeft = PADDING_NORMAL
    paddingRight = PADDING_NORMAL
  } else {
    // Square and Portrait: 2 columns
    columns = 2

    if (classification.captionClass === "caption-side") {
      // Caption on the side: extra padding on left, normal on right
      paddingLeft = PADDING_SIDE_CAPTION
      paddingRight = PADDING_NORMAL
    } else {
      // Caption on bottom: normal padding on both sides
      paddingLeft = PADDING_NORMAL
      paddingRight = PADDING_NORMAL
    }
  }

  // Calculate total card width in rem
  // Formula: columns × column_width + (columns - 1) × gap
  const cardWidthRem = columns * COLUMN_WIDTH_REM + (columns - 1) * GAP_REM

  // Calculate image width in rem (card width minus padding)
  const imageWidthRem = cardWidthRem - paddingLeft - paddingRight

  // Convert rem to viewport-relative calc() expression
  // 1rem = 0.395vw + 14.42px (in the scaling range)
  const vwComponent = imageWidthRem * REM_TO_VW
  const pxComponent = imageWidthRem * REM_TO_PX_BASE

  // Calculate display width in pixels (at maximum rem value)
  const displayWidth = Math.round(imageWidthRem * REM_MAX_PX)

  // Calculate min/max bounds for clamp()
  const minWidth = Math.round(imageWidthRem * REM_MIN_PX)
  const maxWidth = displayWidth

  // Generate sizes attribute with proper clamping
  // This tells the browser the actual rendered size at different viewports
  const sizesAttr = `clamp(${minWidth}px, calc(${vwComponent.toFixed(2)}vw + ${pxComponent.toFixed(2)}px), ${maxWidth}px)`

  return { displayWidth, sizesAttr }
}

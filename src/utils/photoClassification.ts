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

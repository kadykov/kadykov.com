// Helper functions for photo metadata handling
import type { PhotoManifestItem } from "./photoManifestSchema"

/**
 * Generate appropriate alt text for a photo.
 *
 * Priority:
 * 1. photo.notes (custom alt text from Darktable)
 * 2. photo.title (concise title)
 * 3. Generated text with date context
 *
 * Note: In Darktable, we use the "notes" field to store alt text.
 * Alt text should be concise (~150 chars) and describe what's visually
 * in the image for users who cannot see it.
 */
export function getPhotoAltText(
  photo: PhotoManifestItem,
  displayDate?: string
): string {
  // Use custom alt text if provided
  if (photo.notes) {
    return photo.notes
  }

  // Fall back to title
  if (photo.title) {
    return photo.title
  }

  // Generate descriptive alt text with date
  if (displayDate) {
    return `Photograph from ${displayDate}`
  }

  // Last resort: use filename without extension
  const filenameWithoutExt = photo.filename.replace(/\.[^.]+$/, "")
  return `Photograph: ${filenameWithoutExt}`
}

/**
 * Format a date for display in alt text or captions.
 * Returns a human-readable date string or null if no date available.
 */
export function getPhotoDisplayDate(photo: PhotoManifestItem): string | null {
  if (photo.dateTaken) {
    const date = new Date(photo.dateTaken)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (photo.year && photo.month && photo.day) {
    const date = new Date(photo.year, photo.month - 1, photo.day)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return null
}

/**
 * Format an ISO date string (YYYY-MM-DD) to human-readable format.
 * Returns a human-readable date string (e.g., "January 15, 2024").
 */
export function formatDateString(isoDateString: string): string {
  const date = new Date(isoDateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

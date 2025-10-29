/**
 * Converts a string to a URL-safe slug
 * - Replaces spaces with hyphens
 * - Replaces slashes with hyphens
 * - Removes or replaces other special characters
 * - Converts to lowercase for consistency
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\//g, "-") // Replace slashes with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word chars (except hyphens)
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, "") // Trim hyphens from end
}

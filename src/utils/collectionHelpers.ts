/**
 * Generic helper functions for working with Astro collections.
 * These utilities extract unique values and count occurrences from any collection type.
 */

/**
 * Counts occurrences of values extracted from collection items.
 * Handles single values, arrays, null, and undefined.
 *
 * @param items - Array of items from any collection
 * @param getter - Function to extract the value(s) to count from each item
 * @returns Map of unique values to their occurrence counts
 *
 * @example
 * // Count photos by camera model
 * const cameraCounts = countByField(allPhotos, photo => photo.cameraModel)
 *
 * @example
 * // Count blog posts by tags (array field)
 * const tagCounts = countByField(allPosts, post => post.data.tags)
 */
export function countByField<T>(
  items: T[],
  getter: (item: T) => string | string[] | null | undefined
): Map<string, number> {
  const counts = new Map<string, number>()

  items.forEach((item) => {
    const value = getter(item)

    if (value === null || value === undefined) {
      return
    }

    // Handle array of values (like tags)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          counts.set(v, (counts.get(v) || 0) + 1)
        }
      })
    } else {
      // Handle single value
      counts.set(value, (counts.get(value) || 0) + 1)
    }
  })

  return counts
}

/**
 * Extracts unique values from collection items and sorts them alphabetically.
 * Handles single values, arrays, null, and undefined.
 *
 * @param items - Array of items from any collection
 * @param getter - Function to extract the value(s) from each item
 * @returns Sorted array of unique values
 *
 * @example
 * // Get unique camera models
 * const cameras = getUniqueValues(allPhotos, photo => photo.cameraModel)
 *
 * @example
 * // Get unique tags (with lowercase normalization)
 * const tags = getUniqueValues(allPosts, post => post.data.tags?.map(t => t.toLowerCase()))
 */
export function getUniqueValues<T>(
  items: T[],
  getter: (item: T) => string | string[] | null | undefined
): string[] {
  const uniqueSet = new Set<string>()

  items.forEach((item) => {
    const value = getter(item)

    if (value === null || value === undefined) {
      return
    }

    // Handle array of values (like tags)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueSet.add(v)
        }
      })
    } else {
      // Handle single value
      uniqueSet.add(value)
    }
  })

  return Array.from(uniqueSet).sort((a, b) => a.localeCompare(b))
}

/**
 * Formats a count for display next to an item.
 *
 * @param count - The number to display
 * @returns Formatted string in the format "(123)"
 *
 * @example
 * // Returns "(42)"
 * formatCount(42)
 */
export function formatCount(count: number): string {
  return `(${count})`
}

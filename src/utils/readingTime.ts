import readingTime from "reading-time"

export interface ReadingTimeResult {
  text: string // "5 min read"
  minutes: number // 5.2
  time: number // milliseconds
  words: number // word count
}

/**
 * Calculate reading time from content body.
 * Works with raw Markdoc/Markdown content - the reading-time package
 * handles markup syntax gracefully.
 */
export function getReadingTime(content: string): ReadingTimeResult {
  return readingTime(content)
}

/**
 * Format minutes as ISO 8601 duration for datetime attribute.
 * e.g., 5 minutes -> "PT5M"
 */
export function formatReadingTimeDuration(minutes: number): string {
  return `PT${Math.ceil(minutes)}M`
}

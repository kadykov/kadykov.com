/**
 * Blog Post OpenGraph Template
 *
 * Extended version of general template with:
 * - Tags
 * - Publication date
 * - Horizontal rule separator (brand element)
 */

import {
  BaseTemplate,
  AutoTitle,
  Description,
  TagRow,
  DateDisplay,
  // HorizontalRule, // Commented out for frameless design
} from "./base"

export interface BlogOGProps {
  title: string
  headline?: string // Visual headline for OG image (defaults to title)
  subtitle?: string // Supporting text below headline
  description: string
  logoSvg: string
  tags: string[]
  pubDate: Date
  lastUpdatedDate?: Date
}

/**
 * Truncate text to a maximum length with ellipsis
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3).trim() + "..."
}

/**
 * Calculate available width for title in the content area
 * Layout: 1200px total - 60px*2 padding - 160px logo - 40px logo margin
 * = 1200 - 120 - 160 - 40 = 880px
 */
const CONTENT_WIDTH = 880

export function BlogOGTemplate({
  title,
  headline,
  subtitle,
  description,
  logoSvg,
  tags,
  pubDate,
}: BlogOGProps) {
  // Use headline for display (falls back to title)
  const displayHeadline = headline ?? title
  // Use subtitle if provided, otherwise fall back to truncated description
  const displaySubtitle = subtitle ?? truncate(description, 140)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <AutoTitle maxWidth={CONTENT_WIDTH} maxLines={2}>
        {displayHeadline}
      </AutoTitle>
      <Description>{displaySubtitle}</Description>

      {/* Horizontal rule separator - commented out for frameless design */}
      {/* <HorizontalRule /> */}

      {/* Metadata row with date and tags */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <DateDisplay date={pubDate} />
        {tags.length > 0 && <TagRow tags={tags} maxTags={4} />}
      </div>
    </BaseTemplate>
  )
}

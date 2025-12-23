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
  HorizontalRule,
} from "./base"

export interface BlogOGProps {
  title: string
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
 * Layout: 1200px total - 80px*2 padding - 48px*2 card padding - 180px logo - 40px logo margin - 20px title bar
 * = 1200 - 160 - 96 - 180 - 40 - 20 = 704px
 */
const CONTENT_WIDTH = 704

export function BlogOGTemplate({
  title,
  description,
  logoSvg,
  tags,
  pubDate,
}: BlogOGProps) {
  // Truncate description (title auto-scales)
  const displayDescription = truncate(description, 140)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <AutoTitle maxWidth={CONTENT_WIDTH} maxLines={2}>
        {title}
      </AutoTitle>
      <Description>{displayDescription}</Description>

      {/* Horizontal rule separator */}
      <HorizontalRule />

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

/**
 * Blog Post OpenGraph Template
 *
 * Extended version of general template with:
 * - Tags
 * - Publication date
 * - Optional last updated date
 */

import { BaseTemplate, Title, Description, TagRow, DateDisplay } from "./base"

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

export function BlogOGTemplate({
  title,
  description,
  logoSvg,
  tags,
  pubDate,
}: BlogOGProps) {
  // Truncate for OG image
  const displayTitle = truncate(title, 70) // Slightly shorter for blog to fit metadata
  const displayDescription = truncate(description, 150)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <Title size="medium">{displayTitle}</Title>
      <Description>{displayDescription}</Description>

      {/* Metadata row with date and tags */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        <DateDisplay date={pubDate} />
        {tags.length > 0 && <TagRow tags={tags} maxTags={4} />}
      </div>
    </BaseTemplate>
  )
}

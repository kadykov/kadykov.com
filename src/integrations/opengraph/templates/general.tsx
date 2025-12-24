/**
 * General Page OpenGraph Template
 *
 * Used for static pages: About, Privacy Policy, Contact, etc.
 * Simple layout with logo, title, description, and brand elements.
 */

import { BaseTemplate, AutoTitle, Description, HorizontalRule } from "./base"

export interface GeneralOGProps {
  title: string
  headline?: string // Visual headline for OG image (defaults to title)
  subtitle?: string // Supporting text below headline
  description: string
  logoSvg: string
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

export function GeneralOGTemplate({
  title,
  headline,
  subtitle,
  description,
  logoSvg,
}: GeneralOGProps) {
  // Use headline for display (falls back to title)
  const displayHeadline = headline ?? title
  // Use subtitle if provided, otherwise fall back to truncated description
  const displaySubtitle = subtitle ?? truncate(description, 160)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <AutoTitle maxWidth={CONTENT_WIDTH} maxLines={3}>
        {displayHeadline}
      </AutoTitle>
      <Description>{displaySubtitle}</Description>
      <HorizontalRule />
    </BaseTemplate>
  )
}

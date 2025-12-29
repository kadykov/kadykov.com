/**
 * General Page OpenGraph Template
 *
 * Used for static pages: About, Privacy Policy, Contact, etc.
 * Simple layout with logo, title, description, and brand elements.
 */

import {
  BaseTemplate,
  AutoTitle,
  AutoSubtitle,
  LAYOUT,
  getSubtitleHeight,
  // HorizontalRule, // Commented out for frameless design
} from "./base"

export interface GeneralOGProps {
  title: string
  headline?: string // Visual headline for OG image (defaults to title)
  subtitle?: string // Supporting text below headline
  description: string
  logoSvg: string
}

/**
 * Calculate available height for headline after accounting for subtitle
 *
 * Layout breakdown:
 * - Content height: 510px (630 - 60*2 padding)
 * - Subtitle: ~2 lines at 48px * 1.35 line-height = ~130px
 * - Gap between title and subtitle: 16px
 * - Available for title: 510 - 130 - 16 = ~364px
 */
function calculateTitleMaxHeight(subtitleText: string): number {
  const subtitleHeight = getSubtitleHeight(subtitleText, LAYOUT.contentWidth, 2)
  return LAYOUT.contentHeight - subtitleHeight - LAYOUT.contentGap
}

export function GeneralOGTemplate({
  title,
  headline,
  subtitle,
  description,
  logoSvg,
}: GeneralOGProps) {
  // Use headline for display (falls back to title)
  const displayHeadline = headline ?? title
  // Use subtitle if provided, otherwise fall back to description
  const displaySubtitle = subtitle ?? description

  // Calculate available height for the title
  const titleMaxHeight = calculateTitleMaxHeight(displaySubtitle)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <AutoTitle
        maxWidth={LAYOUT.contentWidth}
        maxLines={3}
        maxHeight={titleMaxHeight}
      >
        {displayHeadline}
      </AutoTitle>
      <AutoSubtitle maxWidth={LAYOUT.contentWidth} maxLines={2}>
        {displaySubtitle}
      </AutoSubtitle>
      {/* <HorizontalRule /> */}
    </BaseTemplate>
  )
}

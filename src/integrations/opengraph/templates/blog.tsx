/**
 * Blog Post OpenGraph Template
 *
 * Extended version of general template with:
 * - Tags (hashtag text style matching website)
 * - Publication date
 */

import {
  BaseTemplate,
  AutoTitle,
  AutoSubtitle,
  TagList,
  DateDisplay,
  LAYOUT,
  getSubtitleHeight,
  getTagListHeight,
  getDateDisplayHeight,
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
 * Calculate available height for headline after accounting for other elements
 *
 * Layout breakdown:
 * - Content height: 510px (630 - 60*2 padding)
 * - Subtitle: ~2 lines at 48px * 1.35 = ~130px
 * - Date: 1 line at 28px * 1.4 = ~39px
 * - Tags: 1 line at 32px * 1.4 = ~45px
 * - Gaps: 16px * 3 = 48px (between title-subtitle, subtitle-date, date-tags)
 * - Available for title: 510 - 130 - 39 - 45 - 48 = ~248px
 */
function calculateTitleMaxHeight(
  subtitleText: string,
  hasTags: boolean
): number {
  const subtitleHeight = getSubtitleHeight(subtitleText, LAYOUT.contentWidth, 2)
  const dateHeight = getDateDisplayHeight()
  const tagsHeight = hasTags ? getTagListHeight() : 0
  const gaps = LAYOUT.contentGap * (hasTags ? 3 : 2)

  return LAYOUT.contentHeight - subtitleHeight - dateHeight - tagsHeight - gaps
}

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
  // Use subtitle if provided, otherwise fall back to description
  const displaySubtitle = subtitle ?? description
  const hasTags = tags.length > 0

  // Calculate available height for the title
  const titleMaxHeight = calculateTitleMaxHeight(displaySubtitle, hasTags)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <AutoTitle
        maxWidth={LAYOUT.contentWidth}
        maxLines={2}
        maxHeight={titleMaxHeight}
      >
        {displayHeadline}
      </AutoTitle>
      <AutoSubtitle maxWidth={LAYOUT.contentWidth} maxLines={2}>
        {displaySubtitle}
      </AutoSubtitle>

      {/* Metadata: date and tags */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <DateDisplay date={pubDate} />
        {hasTags && <TagList tags={tags} maxTags={5} />}
      </div>
    </BaseTemplate>
  )
}

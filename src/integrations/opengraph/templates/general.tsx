/**
 * General Page OpenGraph Template
 *
 * Used for static pages: About, Privacy Policy, Contact, etc.
 * Simple layout with logo, title, and description.
 */

import { BaseTemplate, Title, Description } from "./base"

export interface GeneralOGProps {
  title: string
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

export function GeneralOGTemplate({
  title,
  description,
  logoSvg,
}: GeneralOGProps) {
  // Truncate title and description to fit nicely
  const displayTitle = truncate(title, 80)
  const displayDescription = truncate(description, 180)

  return (
    <BaseTemplate logoSvg={logoSvg}>
      <Title>{displayTitle}</Title>
      <Description>{displayDescription}</Description>
    </BaseTemplate>
  )
}

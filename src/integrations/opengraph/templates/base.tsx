/**
 * Base OpenGraph Template
 *
 * Shared layout elements for all OG images:
 * - Logo on the left
 * - Content area on the right
 * - Consistent background and styling
 */

import type { ReactNode } from "react"
import { defaultPalette, colors } from "../colors"
import { fontFamilies } from "../fonts"

// OG Image dimensions (Facebook recommended)
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

interface BaseTemplateProps {
  children: ReactNode
  logoSvg: string // SVG content as string (will be embedded as data URL)
}

/**
 * Convert SVG string to data URL for embedding in Satori
 */
export function svgToDataUrl(svg: string): string {
  // Remove dark mode styles from SVG for OG images (always use light mode)
  const lightModeSvg = svg.replace(/<style>.*?<\/style>/s, "")
  const encoded = Buffer.from(lightModeSvg).toString("base64")
  return `data:image/svg+xml;base64,${encoded}`
}

/**
 * Base template wrapper with logo and content area
 */
export function BaseTemplate({ children, logoSvg }: BaseTemplateProps) {
  const logoDataUrl = svgToDataUrl(logoSvg)

  return (
    <div
      style={{
        display: "flex",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: defaultPalette.background,
        fontFamily: fontFamilies.sans,
        padding: 60,
      }}
    >
      {/* Logo column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 200,
          marginRight: 40,
        }}
      >
        <img src={logoDataUrl} width={160} height={160} alt="" />
      </div>

      {/* Content column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          gap: 20,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Title component with consistent styling
 */
interface TitleProps {
  children: ReactNode
  size?: "large" | "medium" | "small"
}

export function Title({ children, size = "large" }: TitleProps) {
  const fontSize = size === "large" ? 56 : size === "medium" ? 44 : 36

  return (
    <div
      style={{
        display: "flex",
        fontFamily: fontFamilies.serif,
        fontSize,
        fontWeight: 400,
        color: defaultPalette.textPrimary,
        lineHeight: 1.2,
        // Limit to 3 lines with ellipsis would require JS,
        // so we'll rely on template logic to truncate if needed
      }}
    >
      {children}
    </div>
  )
}

/**
 * Description component
 */
interface DescriptionProps {
  children: ReactNode
}

export function Description({ children }: DescriptionProps) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 24,
        color: defaultPalette.textSecondary,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Tag/metadata pill component
 */
interface TagProps {
  children: ReactNode
}

export function Tag({ children }: TagProps) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 16,
        color: colors.brand.primary,
        backgroundColor: colors.surface.offWhite,
        padding: "6px 12px",
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Row of tags
 */
interface TagRowProps {
  tags: string[]
  maxTags?: number
}

export function TagRow({ tags, maxTags = 4 }: TagRowProps) {
  const displayTags = tags.slice(0, maxTags)
  const remaining = tags.length - maxTags

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {displayTags.map((tag, i) => (
        <Tag key={i}>{tag}</Tag>
      ))}
      {remaining > 0 && <Tag>+{remaining} more</Tag>}
    </div>
  )
}

/**
 * Date display component
 */
interface DateDisplayProps {
  date: Date
  label?: string
}

export function DateDisplay({ date, label }: DateDisplayProps) {
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      style={{
        display: "flex",
        fontSize: 18,
        color: defaultPalette.textSecondary,
      }}
    >
      {label && <span style={{ marginRight: 8 }}>{label}</span>}
      {formatted}
    </div>
  )
}

/**
 * Base OpenGraph Template
 *
 * Design system for OG images matching the website style:
 * - Fibonacci pattern background (two overlapping SVG patterns)
 * - Content card with elevation shadow
 * - Sans-serif headings with weight graduation (lighter = larger)
 * - Serif body text
 * - Brand elements: vertical bar on titles, horizontal rule separator
 */

import type { ReactNode } from "react"
import { defaultPalette, colors, fibonacciPatterns } from "../colors"
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
 * Base template wrapper with Fibonacci pattern background and content card
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
        // Fibonacci pattern background (two overlapping patterns)
        backgroundImage: `${fibonacciPatterns.pattern1}, ${fibonacciPatterns.pattern2}`,
        backgroundSize: "260px 160px, 420px 260px",
        fontFamily: fontFamilies.sans,
        padding: 80,
      }}
    >
      {/* Content card with elevation */}
      <div
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: colors.surface.light,
          borderRadius: 8,
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.08)",
          padding: 48,
        }}
      >
        {/* Logo column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 180,
            marginRight: 40,
          }}
        >
          <img src={logoDataUrl} width={140} height={140} alt="" />
        </div>

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            gap: 16,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Title component with brand styling
 *
 * Features:
 * - Sans-serif font with weight graduation (lighter for larger text)
 * - Vertical primary-colored bar on the left (brand element)
 * - Negative letter-spacing for tighter headings
 */
interface TitleProps {
  children: ReactNode
  size?: "large" | "medium" | "small"
}

export function Title({ children, size = "large" }: TitleProps) {
  // Font size and weight graduation (larger = lighter weight for consistent stroke)
  const styles = {
    large: { fontSize: 52, fontWeight: 200 },
    medium: { fontSize: 42, fontWeight: 300 },
    small: { fontSize: 34, fontWeight: 400 },
  }

  const { fontSize, fontWeight } = styles[size]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Vertical bar (brand element) */}
      <div
        style={{
          width: 4,
          backgroundColor: colors.brand.primary,
          marginRight: 16,
          borderRadius: 2,
        }}
      />
      {/* Title text */}
      <div
        style={{
          display: "flex",
          fontFamily: fontFamilies.sans,
          fontSize,
          fontWeight,
          color: defaultPalette.textPrimary,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Font size configuration for auto-scaling titles
 *
 * Algorithm: Try sizes from largest to smallest, picking the first that fits.
 *
 * Each entry defines:
 * - fontSize: Size in pixels
 * - fontWeight: Weight (lighter weights for larger sizes keep stroke width consistent)
 * - charWidthRatio: Average character width as proportion of fontSize
 *   This ratio depends on WEIGHT, not size (heavier = wider characters):
 *   - Weight 200-300 (thin/light): ~0.48-0.50 (narrow)
 *   - Weight 400-500 (regular/medium): ~0.52-0.54 (wider)
 *
 * Tuning guide:
 * - To prefer larger titles: Remove smaller sizes or adjust maxLines in templates
 * - To prefer bolder titles: Increase weights (but maintain size/weight balance)
 * - To fix sizing accuracy: Adjust charWidthRatio per weight (test with real text)
 */
const TITLE_SIZES = [
  { fontSize: 80, fontWeight: 200, charWidthRatio: 0.48 }, // Extra Large: lightest, narrow chars
  { fontSize: 72, fontWeight: 300, charWidthRatio: 0.5 }, // Largest: light weight, narrow chars
  { fontSize: 64, fontWeight: 400, charWidthRatio: 0.52 }, // Large: regular weight
  { fontSize: 56, fontWeight: 500, charWidthRatio: 0.54 }, // Medium: medium weight, wider chars
  { fontSize: 48, fontWeight: 600, charWidthRatio: 0.56 }, // Small: semi-bold, widest chars
] as const

/**
 * Estimate the width of text at a given font size
 * Uses character count with font-specific width ratios
 */
function estimateTextWidth(
  text: string,
  fontSize: number,
  charWidthRatio: number
): number {
  // Count characters, giving more weight to wide characters
  let effectiveLength = 0
  for (const char of text) {
    if (/[mwMW@]/.test(char)) {
      effectiveLength += 1.3 // Wide characters
    } else if (/[ilIj.,;:'"!|]/.test(char)) {
      effectiveLength += 0.4 // Narrow characters
    } else if (/[A-Z]/.test(char)) {
      effectiveLength += 1.1 // Uppercase slightly wider
    } else {
      effectiveLength += 1.0 // Normal characters
    }
  }
  return effectiveLength * fontSize * charWidthRatio
}

/**
 * Calculate how many lines the text would need at a given font size
 */
function estimateLineCount(
  text: string,
  maxWidth: number,
  fontSize: number,
  charWidthRatio: number
): number {
  const textWidth = estimateTextWidth(text, fontSize, charWidthRatio)
  return Math.ceil(textWidth / maxWidth)
}

/**
 * Auto-scaling Title component
 *
 * Automatically selects the optimal font size based on:
 * - Available width (maxWidth)
 * - Maximum allowed lines (maxLines)
 * - Text length and character composition
 *
 * Features:
 * - Sans-serif font with weight graduation (lighter for larger text)
 * - Vertical primary-colored bar on the left (brand element)
 * - Negative letter-spacing for tighter headings
 */
interface AutoTitleProps {
  children: string
  maxWidth: number // Available width in pixels for the title text
  maxLines?: number // Maximum number of lines (default: 2)
}

export function AutoTitle({
  children,
  maxWidth,
  maxLines = 2,
}: AutoTitleProps) {
  const text = children

  // Find the largest font size that fits within constraints
  let selectedSize = TITLE_SIZES[TITLE_SIZES.length - 1] // Fallback to smallest

  for (const sizeConfig of TITLE_SIZES) {
    const lineCount = estimateLineCount(
      text,
      maxWidth,
      sizeConfig.fontSize,
      sizeConfig.charWidthRatio
    )

    if (lineCount <= maxLines) {
      selectedSize = sizeConfig
      break
    }
  }

  const { fontSize, fontWeight } = selectedSize

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Vertical bar (brand element) */}
      <div
        style={{
          width: 4,
          backgroundColor: colors.brand.primary,
          marginRight: 16,
          borderRadius: 2,
        }}
      />
      {/* Title text */}
      <div
        style={{
          display: "flex",
          fontFamily: fontFamilies.sans,
          fontSize,
          fontWeight,
          color: defaultPalette.textPrimary,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </div>
    </div>
  )
}

/**
 * Description component with serif font
 */
interface DescriptionProps {
  children: ReactNode
}

export function Description({ children }: DescriptionProps) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: fontFamilies.serif,
        fontSize: 22,
        fontWeight: 500,
        color: defaultPalette.textSecondary,
        lineHeight: 1.5,
        paddingLeft: 20, // Align with title text (after the bar)
      }}
    >
      {children}
    </div>
  )
}

/**
 * Horizontal rule separator (brand element)
 *
 * Right-aligned with a solid square on the right end
 * Mimics the CSS: border-width: 0 0.5rem 0.15rem 0
 */
export function HorizontalRule() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingLeft: 20,
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Horizontal line */}
        <div
          style={{
            width: 200,
            height: 3,
            backgroundColor: colors.brand.primary,
          }}
        />
        {/* Square end cap */}
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: colors.brand.primary,
            marginLeft: -3, // Overlap slightly
          }}
        />
      </div>
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
        fontSize: 14,
        fontWeight: 600,
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
        paddingLeft: 20, // Align with content after the bar
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
        fontSize: 16,
        fontWeight: 400,
        color: defaultPalette.textSecondary,
        paddingLeft: 20, // Align with content after the bar
      }}
    >
      {label && <span style={{ marginRight: 8 }}>{label}</span>}
      {formatted}
    </div>
  )
}

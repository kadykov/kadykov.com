/**
 * Base OpenGraph Template
 *
 * Frameless design system for OG images:
 * - Subtle Fibonacci patterns directly as background (larger, 2x scale)
 * - Content uses full available space (single padding, no card)
 * - Sans-serif headings with weight graduation (lighter = larger)
 * - Serif body text
 * - Responsive font sizing based on available space
 *
 * Brand elements (currently commented out, available if needed):
 * - Vertical bar on titles
 * - Horizontal rule separator
 */

import type { ReactNode } from "react"
import { defaultPalette, fibonacciPatterns } from "../colors"
import { fontFamilies } from "../fonts"

// Debug mode: set OG_DEBUG=1 environment variable to enable
const DEBUG = process.env.OG_DEBUG === "1"

function debugLog(component: string, data: Record<string, unknown>) {
  if (DEBUG) {
    console.log(`[OG:${component}]`, JSON.stringify(data, null, 2))
  }
}

// OG Image dimensions (Facebook recommended)
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

// Layout constants for content area calculations
export const LAYOUT = {
  padding: 60,
  logoWidth: 160,
  logoMargin: 40,
  contentGap: 16,
  // Calculated content area dimensions
  get contentWidth() {
    return OG_WIDTH - this.padding * 2 - this.logoWidth - this.logoMargin
  },
  get contentHeight() {
    return OG_HEIGHT - this.padding * 2
  },
} as const

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
 * Base template wrapper with subtle Fibonacci pattern background
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
        // Larger, subtle Fibonacci patterns for text legibility
        backgroundImage: `${fibonacciPatterns.pattern1}, ${fibonacciPatterns.pattern2}`,
        backgroundSize: fibonacciPatterns.sizes,
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
          width: 160,
          marginRight: 40,
        }}
      >
        <img src={logoDataUrl} width={140} height={140} alt="" />
      </div>

      {/* Content column - uses full available space */}
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
 * Larger sizes now possible with frameless design (more available width).
 *
 * Each entry defines:
 * - fontSize: Size in pixels
 * - fontWeight: Weight (lighter weights for larger sizes keep stroke width consistent)
 * - charWidthRatio: Average character width as proportion of fontSize
 *   This ratio depends on WEIGHT, not size (heavier = wider characters):
 *   - Weight 200-300 (thin/light): ~0.48-0.50 (narrow)
 *   - Weight 400-500 (regular/medium): ~0.52-0.54 (wider)
 */
const TITLE_SIZES = [
  // Largest: very tight spacing, works for short titles
  {
    fontSize: 180,
    fontWeight: 300,
    charWidthRatio: 0.5,
    lineHeight: 1.0,
    letterSpacing: -0.04,
  },
  // Large: still tight but slightly more relaxed
  {
    fontSize: 96,
    fontWeight: 400,
    charWidthRatio: 0.52,
    lineHeight: 1.05,
    letterSpacing: -0.03,
  },
  // Medium: balanced spacing
  {
    fontSize: 72,
    fontWeight: 500,
    charWidthRatio: 0.54,
    lineHeight: 1.1,
    letterSpacing: -0.02,
  },
  // Small: more generous spacing for legibility
  {
    fontSize: 40,
    fontWeight: 600,
    charWidthRatio: 0.56,
    lineHeight: 1.2,
    letterSpacing: -0.01,
  },
] as const

/**
 * Estimate the width of text at a given font size
 * Uses character count with font-specific width ratios and letter spacing
 *
 * @param text - The text to measure
 * @param fontSize - Font size in pixels
 * @param charWidthRatio - Average character width as proportion of fontSize
 * @param letterSpacing - Letter spacing as proportion of fontSize (e.g., -0.02 for -2%)
 */
function estimateTextWidth(
  text: string,
  fontSize: number,
  charWidthRatio: number,
  letterSpacing: number = 0
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

  // Base width from character widths
  const baseWidth = effectiveLength * fontSize * charWidthRatio

  // Letter spacing adds/removes space between characters (n-1 gaps for n characters)
  const letterSpacingAdjustment = (text.length - 1) * fontSize * letterSpacing

  return baseWidth + letterSpacingAdjustment
}

/**
 * Estimate the number of lines text will take when wrapped at word boundaries
 *
 * This simulates CSS word-wrap behavior where text breaks at spaces,
 * not mid-word. Much more accurate than simple width/maxWidth calculation.
 *
 * @param text - The text to measure
 * @param maxWidth - Maximum available width in pixels
 * @param fontSize - Font size in pixels
 * @param charWidthRatio - Average character width as proportion of fontSize
 * @param letterSpacing - Letter spacing as proportion of fontSize
 */
function estimateLineCountWordWrap(
  text: string,
  maxWidth: number,
  fontSize: number,
  charWidthRatio: number,
  letterSpacing: number = 0
): number {
  if (!text.trim()) return 0

  // Split into words (preserving punctuation attached to words)
  const words = text.split(/\s+/)
  if (words.length === 0) return 0

  let lineCount = 1
  let currentLineWidth = 0
  const spaceWidth = fontSize * charWidthRatio * 0.5 // Space is typically half a character

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const wordWidth = estimateTextWidth(
      word,
      fontSize,
      charWidthRatio,
      letterSpacing
    )

    if (currentLineWidth === 0) {
      // First word on line - always fits (even if it overflows)
      currentLineWidth = wordWidth
    } else {
      // Check if word fits on current line (with space before it)
      const widthWithWord = currentLineWidth + spaceWidth + wordWidth

      if (widthWithWord <= maxWidth) {
        // Word fits, add it to current line
        currentLineWidth = widthWithWord
      } else {
        // Word doesn't fit, start new line
        lineCount++
        currentLineWidth = wordWidth
      }
    }
  }

  return lineCount
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
  maxHeight?: number // Available height in pixels (optional, for vertical constraint)
}

export function AutoTitle({
  children,
  maxWidth,
  maxLines = 2,
  maxHeight,
}: AutoTitleProps) {
  const text = children

  // Find the largest font size that fits within constraints
  let selectedSize = TITLE_SIZES[TITLE_SIZES.length - 1] // Fallback to smallest
  const debugSizes: Array<{
    fontSize: number
    estimatedLines: number
    estimatedHeight: number
    fitsWidth: boolean
    fitsHeight: boolean
  }> = []

  for (const sizeConfig of TITLE_SIZES) {
    // Use word-wrap aware line counting for accurate estimation
    const lineCount = estimateLineCountWordWrap(
      text,
      maxWidth,
      sizeConfig.fontSize,
      sizeConfig.charWidthRatio,
      sizeConfig.letterSpacing
    )
    const estimatedHeight =
      lineCount * sizeConfig.fontSize * sizeConfig.lineHeight

    // Check both line count and height constraints
    const fitsWidth = lineCount <= maxLines
    const fitsHeight = !maxHeight || estimatedHeight <= maxHeight

    debugSizes.push({
      fontSize: sizeConfig.fontSize,
      estimatedLines: lineCount,
      estimatedHeight: Math.round(estimatedHeight),
      fitsWidth,
      fitsHeight,
    })

    if (fitsWidth && fitsHeight) {
      selectedSize = sizeConfig
      break
    }
  }

  debugLog("AutoTitle", {
    text: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
    textLength: text.length,
    maxWidth,
    maxLines,
    maxHeight,
    selectedFontSize: selectedSize.fontSize,
    selectedFontWeight: selectedSize.fontWeight,
    sizeAnalysis: debugSizes,
  })

  const { fontSize, fontWeight, lineHeight, letterSpacing } = selectedSize

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: fontFamilies.sans,
          fontSize,
          fontWeight,
          color: defaultPalette.textPrimary,
          lineHeight,
          letterSpacing: `${letterSpacing}em`,
        }}
      >
        {text}
      </div>
    </div>
  )
}

/**
 * Subtitle/Description component with serif font and auto-truncation
 *
 * Typography settings (fixed, not dynamic):
 * - Font size: 48px (increased from 26px for better visibility)
 * - Line height: 1.35
 * - Font weight: 400
 * - Character width ratio: ~0.52 (conservative estimate for serif fonts)
 */
const SUBTITLE_STYLE = {
  fontSize: 48,
  fontWeight: 400,
  lineHeight: 1.35,
  charWidthRatio: 0.52,
} as const

interface AutoSubtitleProps {
  children: string
  maxWidth: number // Available width in pixels
  maxLines?: number // Maximum lines before truncation (default: 2)
}

/**
 * Calculate how many lines subtitle text would need (word-wrap aware)
 */
function estimateSubtitleLineCount(text: string, maxWidth: number): number {
  return estimateLineCountWordWrap(
    text,
    maxWidth,
    SUBTITLE_STYLE.fontSize,
    SUBTITLE_STYLE.charWidthRatio,
    0 // No letter-spacing adjustment for serif
  )
}

/**
 * Calculate the height a subtitle will take
 */
export function getSubtitleHeight(
  text: string,
  maxWidth: number,
  maxLines: number = 2
): number {
  const lineCount = Math.min(
    estimateSubtitleLineCount(text, maxWidth),
    maxLines
  )
  return lineCount * SUBTITLE_STYLE.fontSize * SUBTITLE_STYLE.lineHeight
}

/**
 * Truncate text to fit within max lines, adding ellipsis
 * Uses word-wrap aware estimation for accurate truncation
 */
function truncateToFit(
  text: string,
  maxWidth: number,
  maxLines: number
): string {
  const lineCount = estimateSubtitleLineCount(text, maxWidth)
  if (lineCount <= maxLines) return text

  // Truncate word by word until it fits
  const words = text.split(/\s+/)
  let truncated = ""

  for (let i = 0; i < words.length; i++) {
    const candidate = truncated ? `${truncated} ${words[i]}` : words[i]
    const candidateWithEllipsis = candidate + "…"

    // Check if candidate + ellipsis would fit in maxLines
    const estimatedLines = estimateSubtitleLineCount(
      candidateWithEllipsis,
      maxWidth
    )

    if (estimatedLines > maxLines) {
      // Adding this word would overflow, stop here
      break
    }

    truncated = candidate
  }

  return truncated.trim() + "…"
}

export function AutoSubtitle({
  children,
  maxWidth,
  maxLines = 2,
}: AutoSubtitleProps) {
  // Use word-wrap aware line counting
  const estimatedLines = estimateSubtitleLineCount(children, maxWidth)
  const estimatedHeight =
    Math.min(estimatedLines, maxLines) *
    SUBTITLE_STYLE.fontSize *
    SUBTITLE_STYLE.lineHeight
  const wasTruncated = estimatedLines > maxLines

  const displayText = truncateToFit(children, maxWidth, maxLines)
  const displayLines = estimateSubtitleLineCount(displayText, maxWidth)

  debugLog("AutoSubtitle", {
    text: children.slice(0, 50) + (children.length > 50 ? "..." : ""),
    textLength: children.length,
    maxWidth,
    maxLines,
    fontSize: SUBTITLE_STYLE.fontSize,
    estimatedLines,
    estimatedHeight: Math.round(estimatedHeight),
    wasTruncated,
    displayText:
      displayText.slice(0, 60) + (displayText.length > 60 ? "..." : ""),
    displayTextLength: displayText.length,
    displayLines,
  })

  return (
    <div
      style={{
        display: "flex",
        fontFamily: fontFamilies.serif,
        fontSize: SUBTITLE_STYLE.fontSize,
        fontWeight: SUBTITLE_STYLE.fontWeight,
        color: defaultPalette.textSecondary,
        lineHeight: SUBTITLE_STYLE.lineHeight,
      }}
    >
      {displayText}
    </div>
  )
}

/**
 * Tags display component - text-based with hashtag prefix
 *
 * Matches website style: #tag1, #tag2, #tag3.
 * Typography: serif font, same style as subtitle but slightly smaller
 */
const TAGS_STYLE = {
  fontSize: 32,
  fontWeight: 400,
  lineHeight: 1.4,
} as const

interface TagListProps {
  tags: string[]
  maxTags?: number
}

/**
 * Calculate the height the tag list will take (always 1 line)
 */
export function getTagListHeight(): number {
  return TAGS_STYLE.fontSize * TAGS_STYLE.lineHeight
}

export function TagList({ tags, maxTags = 3 }: TagListProps) {
  const displayTags = tags.slice(0, maxTags)
  const remaining = tags.length - maxTags

  // Build the tag string: #tag1, #tag2, #tag3
  let tagText = displayTags.map((tag) => `#${tag}`).join(", ")
  if (remaining > 0) {
    tagText += `, +${remaining} more`
  }

  // Use word-wrap aware line estimation
  // Tags are comma-separated, so they can wrap at commas/spaces
  const charWidthRatio = 0.52
  const estimatedLines = estimateLineCountWordWrap(
    tagText,
    LAYOUT.contentWidth,
    TAGS_STYLE.fontSize,
    charWidthRatio,
    0
  )

  debugLog("TagList", {
    tags,
    tagText,
    textLength: tagText.length,
    fontSize: TAGS_STYLE.fontSize,
    availableWidth: LAYOUT.contentWidth,
    estimatedLines,
    expectedLines: 1,
    overflow: estimatedLines > 1,
  })

  return (
    <div
      style={{
        display: "flex",
        fontFamily: fontFamilies.serif,
        fontSize: TAGS_STYLE.fontSize,
        fontWeight: TAGS_STYLE.fontWeight,
        color: defaultPalette.textSecondary,
        lineHeight: TAGS_STYLE.lineHeight,
      }}
    >
      {tagText}
    </div>
  )
}

/**
 * Date display component
 */
const DATE_STYLE = {
  fontSize: 28,
  fontWeight: 400,
  lineHeight: 1.4,
} as const

interface DateDisplayProps {
  date: Date
  label?: string
}

/**
 * Calculate the height the date display will take (always 1 line)
 */
export function getDateDisplayHeight(): number {
  return DATE_STYLE.fontSize * DATE_STYLE.lineHeight
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
        fontSize: DATE_STYLE.fontSize,
        fontWeight: DATE_STYLE.fontWeight,
        color: defaultPalette.textSecondary,
        lineHeight: DATE_STYLE.lineHeight,
      }}
    >
      {label && <span style={{ marginRight: 8 }}>{label}</span>}
      {formatted}
    </div>
  )
}

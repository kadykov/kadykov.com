/**
 * Font Loading Utilities for Satori
 *
 * Satori requires fonts to be loaded as ArrayBuffer.
 * We use the standard (non-variable) versions of our fonts.
 *
 * Typography approach (matching website CSS):
 * - Headings: Sans-serif with weight inversely proportional to size
 *   - Large titles: weight 200 (lightest, thinnest stroke)
 *   - Medium titles: weight 300
 *   - Small titles: weight 400 (bolder stroke)
 * - Body text: Serif (Bitter) at weight 500
 */

import fs from "node:fs/promises"
import path from "node:path"

// Font file paths (relative to project root)
const FONT_DIR = "node_modules/@fontsource"

export interface FontConfig {
  name: string
  data: ArrayBuffer
  weight: 200 | 300 | 400 | 500 | 600 | 700
  style: "normal" | "italic"
}

/**
 * Load a font file as ArrayBuffer
 */
async function loadFont(fontPath: string): Promise<ArrayBuffer> {
  const absolutePath = path.join(process.cwd(), fontPath)
  const buffer = await fs.readFile(absolutePath)
  // Convert Node.js Buffer to ArrayBuffer
  return new Uint8Array(buffer).buffer as ArrayBuffer
}

/**
 * Load all fonts needed for OpenGraph images
 *
 * We load:
 * - Source Sans 3: 200, 300, 400, 600 for headings (lighter = larger text)
 * - Bitter: 500 for body text (serif for better readability)
 */
export async function loadFonts(): Promise<FontConfig[]> {
  const fonts: FontConfig[] = []

  // Source Sans 3 - Sans-serif for headings
  // Weight graduation: lighter weights for larger text (consistent stroke thickness)
  const sourceSansWeights = [200, 300, 400, 500, 600] as const
  for (const weight of sourceSansWeights) {
    const fontPath = `${FONT_DIR}/source-sans-3/files/source-sans-3-latin-${weight}-normal.woff`
    const data = await loadFont(fontPath)
    fonts.push({
      name: "Source Sans 3",
      data,
      weight,
      style: "normal",
    })
  }

  // Source Sans 3 - Italic variant for dates and emphasis (weight 400)
  const sourceSansItalicPath = `${FONT_DIR}/source-sans-3/files/source-sans-3-latin-400-italic.woff`
  const sourceSansItalicData = await loadFont(sourceSansItalicPath)
  fonts.push({
    name: "Source Sans 3",
    data: sourceSansItalicData,
    weight: 400,
    style: "italic",
  })

  // Bitter - Serif font for body text
  const bitterPath = `${FONT_DIR}/bitter/files/bitter-latin-500-normal.woff`
  const bitterData = await loadFont(bitterPath)
  fonts.push({
    name: "Bitter",
    data: bitterData,
    weight: 500,
    style: "normal",
  })

  // Bitter - Italic variant for dates and emphasis
  const bitterItalicPath = `${FONT_DIR}/bitter/files/bitter-latin-500-italic.woff`
  const bitterItalicData = await loadFont(bitterItalicPath)
  fonts.push({
    name: "Bitter",
    data: bitterItalicData,
    weight: 500,
    style: "italic",
  })

  return fonts
}

/**
 * Get font family string for Satori
 * Satori requires exact font names as registered
 */
export const fontFamilies = {
  sans: "Source Sans 3",
  serif: "Bitter",
} as const

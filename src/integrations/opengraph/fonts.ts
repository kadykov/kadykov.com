/**
 * Font Loading Utilities for Satori
 *
 * Satori requires fonts to be loaded as ArrayBuffer.
 * We use the standard (non-variable) versions of our fonts.
 */

import fs from "node:fs/promises"
import path from "node:path"

// Font file paths (relative to project root)
const FONT_DIR = "node_modules/@fontsource"

export interface FontConfig {
  name: string
  data: ArrayBuffer
  weight: 400 | 500 | 600 | 700
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
 * - Source Sans 3: Regular (400), Medium (500), SemiBold (600) for body text
 * - Bitter: Regular (400) for headings/serif accents
 */
export async function loadFonts(): Promise<FontConfig[]> {
  const fonts: FontConfig[] = []

  // Source Sans 3 - Primary sans-serif font
  const sourceSansWeights = [400, 600] as const
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

  // Bitter - Serif font for headings
  const bitterPath = `${FONT_DIR}/bitter/files/bitter-latin-400-normal.woff`
  const bitterData = await loadFont(bitterPath)
  fonts.push({
    name: "Bitter",
    data: bitterData,
    weight: 400,
    style: "normal",
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

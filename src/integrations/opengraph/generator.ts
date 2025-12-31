/**
 * OpenGraph Image Generator
 *
 * Core functionality to render React components to PNG using Satori + Sharp.
 */

import satori from "satori"
import sharp from "sharp"
import type { ReactNode } from "react"
import { loadFonts, type FontConfig } from "./fonts"
import { OG_WIDTH, OG_HEIGHT } from "./templates/base"

// Cache fonts after first load
let fontsCache: FontConfig[] | null = null

/**
 * Get fonts (loads from disk on first call, then cached)
 */
async function getFonts(): Promise<FontConfig[]> {
  if (!fontsCache) {
    fontsCache = await loadFonts()
  }
  return fontsCache
}

/**
 * Render a React element to SVG using Satori
 */
export async function renderToSvg(element: ReactNode): Promise<string> {
  const fonts = await getFonts()

  const svg = await satori(element as React.ReactElement, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: fonts.map((font) => ({
      name: font.name,
      data: font.data,
      weight: font.weight,
      style: font.style,
    })),
  })

  return svg
}

/**
 * Convert SVG string to PNG buffer using Sharp
 * Optimized for speed with appropriate compression settings
 */
export async function svgToPng(svg: string): Promise<Buffer> {
  const png = await sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9, // Balance between speed and size (default is 6)
      effort: 10, // Minimal effort for faster encoding (range 1-10, default 7)
      quality: 98, // Quality for PNG (0-100)
      palette: true, // Use palette-based PNG for smaller size
      dither: 0, // Disable dithering for speed
    })
    .toBuffer()
  return png
}

/**
 * Render a React element directly to PNG
 */
export async function renderToPng(element: ReactNode): Promise<Buffer> {
  const svg = await renderToSvg(element)
  const png = await svgToPng(svg)
  return png
}

/**
 * Pre-load fonts (call early in build process for better performance)
 */
export async function preloadFonts(): Promise<void> {
  await getFonts()
}

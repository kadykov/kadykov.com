/**
 * Font Preload Configuration
 *
 * Composable system for determining which fonts to preload based on page content.
 * Prevents Cumulative Layout Shift (CLS) by preloading only fonts needed above-the-fold.
 *
 * Font Usage:
 * - sans: Body text, navigation, footer (always needed)
 * - sansItalic: <time> elements in hero/cards (blog posts, blog lists)
 * - serif: <article> content, forms, photo descriptions
 * - serifItalic: Hero <p> subtitle
 * - mono: Photo gallery Polaroid-style captions
 */

// Font preload options
export type FontPreload =
  | "sans"
  | "sansItalic"
  | "serif"
  | "serifItalic"
  | "mono"

/**
 * Semantic flags describing page content that affects font requirements.
 * Each flag corresponds to a specific font need based on CSS styling.
 */
export interface FontPreloadOptions {
  /** Hero section has a <p> subtitle (styled with serif italic) */
  heroSubtitle?: boolean
  /** Page has <article> content or forms (styled with serif) */
  articleContent?: boolean
  /** Has <time> elements in hero or blog cards (styled with sans italic) */
  timeInHero?: boolean
  /** Has photo gallery with Polaroid-style captions (styled with mono) */
  photoGallery?: boolean
}

/**
 * Builds font preload list from semantic content flags.
 * Always includes 'sans' as it's used on every page.
 *
 * @example
 * // Blog post with subtitle and reading time
 * getFontPreload({ heroSubtitle: true, articleContent: true, timeInHero: true })
 * // Returns: ["sans", "serifItalic", "serif", "sansItalic"]
 *
 * @example
 * // Photo gallery page with subtitle
 * getFontPreload({ heroSubtitle: true, photoGallery: true })
 * // Returns: ["sans", "serifItalic", "mono"]
 */
export function getFontPreload(
  options: FontPreloadOptions = {}
): FontPreload[] {
  const fonts: FontPreload[] = ["sans"] // Always needed

  if (options.heroSubtitle) fonts.push("serifItalic")
  if (options.articleContent) fonts.push("serif")
  if (options.timeInHero) fonts.push("sansItalic")
  if (options.photoGallery) fonts.push("mono")

  return fonts
}

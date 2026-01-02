/**
 * Font Preload Configuration
 *
 * Defines which fonts should be preloaded based on page content to prevent
 * Cumulative Layout Shift (CLS) while avoiding unnecessary preloads.
 *
 * Font Usage Analysis:
 * - sans: Body text everywhere (always needed)
 * - sansItalic: <time> elements, <figcaption> in articles (above-fold on blog posts/list)
 * - serif: <article> content, contact form (blog posts, pages, home, contact)
 * - serifItalic: Hero <p> subtitle (pages with hero subtitles)
 * - mono: Photo gallery captions, code blocks (photo galleries)
 */

// Font preload options
export type FontPreload =
  | "sans"
  | "sansItalic"
  | "serif"
  | "serifItalic"
  | "mono"

// Font file mappings - imported as URLs by Vite
export const fontUrls = {
  sans: "@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2",
  sansItalic:
    "@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-italic.woff2",
  serif: "@fontsource-variable/bitter/files/bitter-latin-wght-normal.woff2",
  serifItalic:
    "@fontsource-variable/bitter/files/bitter-latin-wght-italic.woff2",
  mono: "@fontsource-variable/source-code-pro/files/source-code-pro-latin-wght-normal.woff2",
} as const

// Default preload sets for different layout types
export const fontPreloadDefaults = {
  // Base: only sans-serif (navigation, footer text)
  base: ["sans"] as FontPreload[],

  // Blog posts: sans + serif for article + sans italic for reading time in hero
  blogPost: ["sans", "serif", "sansItalic"] as FontPreload[],

  // Pages with hero subtitle: sans + serif + serif italic for subtitle
  pageWithSubtitle: ["sans", "serif", "serifItalic"] as FontPreload[],

  // Pages without hero subtitle: sans + serif for article content
  pageWithoutSubtitle: ["sans", "serif"] as FontPreload[],

  // Photo galleries: sans + mono for captions
  photoGallery: ["sans", "mono"] as FontPreload[],

  // Blog list: sans + serif + sans italic for cards with time elements
  blogList: ["sans", "serif", "sansItalic"] as FontPreload[],

  // Home page: sans + serif for article content
  home: ["sans", "serif"] as FontPreload[],
} as const

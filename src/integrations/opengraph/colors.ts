/**
 * OpenGraph Color Palette
 *
 * Fallback colors in hex format for Satori (OKLCH is not supported).
 * These correspond to the OKLCH design tokens in base.css.
 */

export const colors = {
  // Background colors
  background: {
    light: "#f5f5f5", // Neutral light gray
    dark: "#1a1a1a", // Dark background
  },

  // Text colors
  text: {
    primary: {
      light: "#363636", // Main text (matches logo #main)
      dark: "#c8c7c5", // Light text for dark mode
    },
    secondary: {
      light: "#666666", // Muted text
      dark: "#a0a0a0", // Muted text for dark mode
    },
  },

  // Brand colors (from logo icon.svg)
  brand: {
    primary: "#2f7cab", // Primary blue (logo #primary)
    accent: "#feae39", // Accent yellow/orange (logo #accent)
    main: "#363636", // Main logo color
  },

  // Surface colors (for cards, frames)
  surface: {
    light: "#ffffff", // Pure white
    offWhite: "#f0f0f0", // Off-white for Polaroid frames
    gray: "#e0e0e0", // Light gray border
  },

  // Pattern colors (for Fibonacci background)
  pattern: {
    fill: "rgba(119, 119, 119, 0.035)", // Very subtle for text legibility
  },
} as const

// Default palette for light mode (OG images are typically light)
export const defaultPalette = {
  background: "#f8f8f7", // Subtle warm background for text legibility
  textPrimary: colors.text.primary.light,
  textSecondary: colors.text.secondary.light,
  brandPrimary: colors.brand.primary,
  brandAccent: colors.brand.accent,
  surface: colors.surface.light,
} as const

/**
 * Fibonacci pattern SVG data URLs for background
 *
 * Larger patterns (2x scale) with subtle opacity for good text legibility
 * when content is placed directly on the background.
 */
export const fibonacciPatterns = {
  // 26x16 "golden ratio" rectangle pattern - primary pattern
  pattern1: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 16'%3E%3Cpath fill='rgba(119,119,119,0.04)' d='M10 0v5h3V3h8V0zM0 0v5h8V0zm3 8v5h2V8zm10 3v2H5v3h11v-5zm8-8v5h2V3zm-3 8v5h8v-5z'/%3E%3C/svg%3E")`,

  // 42x26 "golden ratio" rectangle pattern - secondary larger pattern
  pattern2: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 42 26'%3E%3Cpath fill='rgba(119,119,119,0.04)' d='M37 21v2h5v-2zm-3-8v8h3v-8zM29 0v8h13V0zm-8 10v3h5v-3zm0 3h-5v3h5zM5 3H0v2h5zm0 2v8h3V5zM0 18v8h13v-8zm16 0v8h18v-5H21v-3zM8 0v5h13v3h5V0z'/%3E%3C/svg%3E")`,

  // Background sizes (2x larger for more sparse pattern)
  sizes: "520px 320px, 840px 520px",
} as const

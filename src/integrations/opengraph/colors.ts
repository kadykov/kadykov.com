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
} as const

// Default palette for light mode (OG images are typically light)
export const defaultPalette = {
  background: colors.background.light,
  textPrimary: colors.text.primary.light,
  textSecondary: colors.text.secondary.light,
  brandPrimary: colors.brand.primary,
  brandAccent: colors.brand.accent,
  surface: colors.surface.light,
} as const

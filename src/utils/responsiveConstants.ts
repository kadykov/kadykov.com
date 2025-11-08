/**
 * Responsive Design Constants
 *
 * Shared constants for calculating responsive dimensions across the site.
 * These values match the CSS custom properties and clamp() functions in base.css
 */

/**
 * Base font-size scaling: clamp(16px, 0.395vw + 14.42px, 22px)
 * This affects all rem-based calculations throughout the site.
 */
export const REM_SCALING = {
  /** Viewport coefficient: 1rem = VW_COEFFICIENT * vw + PX_BASE */
  VW_COEFFICIENT: 0.395,
  /** Pixel base: 1rem = vw_coefficient * vw + PX_BASE */
  PX_BASE: 14.42,
  /** Minimum rem value in pixels (at narrow viewports) */
  MIN_PX: 16,
  /** Maximum rem value in pixels (at wide viewports) */
  MAX_PX: 22,
  /** Viewport width where rem reaches minimum (16px) */
  MIN_VIEWPORT_PX: 400,
  /** Viewport width where rem reaches maximum (22px) */
  MAX_VIEWPORT_PX: 1920,
} as const

/**
 * Spacing adaptive: clamp(1rem, 6vw - 1rem, 3rem)
 * Used for adaptive padding throughout the site.
 */
export const SPACING_ADAPTIVE = {
  /** Minimum value in rem */
  MIN_REM: 1,
  /** Maximum value in rem */
  MAX_REM: 3,
  /** Viewport coefficient for the middle range: 6vw - 1rem */
  VW_COEFFICIENT: 6,
} as const

/**
 * Converts rem value to viewport-relative calc() expression components
 *
 * @param remValue - Value in rem units
 * @returns Object with vw and px components for calc(vw_component*vw + px_component)
 *
 * @example
 * const { vwComponent, pxComponent } = remToViewport(42);
 * // Returns: { vwComponent: 16.59, pxComponent: 605.64 }
 * // Use in calc: calc(16.59vw + 605.64px)
 */
export function remToViewport(remValue: number): {
  vwComponent: number
  pxComponent: number
} {
  return {
    vwComponent: remValue * REM_SCALING.VW_COEFFICIENT,
    pxComponent: remValue * REM_SCALING.PX_BASE,
  }
}

/**
 * Converts rem value to pixels at different viewport sizes
 *
 * @param remValue - Value in rem units
 * @returns Object with min and max pixel values
 */
export function remToPixels(remValue: number): {
  minPx: number
  maxPx: number
} {
  return {
    minPx: remValue * REM_SCALING.MIN_PX,
    maxPx: remValue * REM_SCALING.MAX_PX,
  }
}

/**
 * Formats a calc() expression with proper sign handling
 *
 * @param vwComponent - Viewport width coefficient (e.g., 11.85 for 11.85vw)
 * @param pxComponent - Pixel component (can be negative)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted calc() string (e.g., "calc(11.85vw + 432.60px)" or "calc(99.21vw - 28.84px)")
 *
 * @example
 * formatCalc(11.85, 432.6) // "calc(11.85vw + 432.60px)"
 * formatCalc(99.21, -28.84) // "calc(99.21vw - 28.84px)"
 */
export function formatCalc(
  vwComponent: number,
  pxComponent: number,
  decimals: number = 2
): string {
  const vw = vwComponent.toFixed(decimals)
  const px = Math.abs(pxComponent).toFixed(decimals)
  const operator = pxComponent >= 0 ? "+" : "-"
  return `calc(${vw}vw ${operator} ${px}px)`
}

/**
 * Calculates spacing-adaptive value in viewport-relative units
 * spacing-adaptive = clamp(1rem, 6vw - 1rem, 3rem)
 *
 * @returns Object with viewport-relative calc() components for the middle range
 *
 * @example
 * const { vwComponent, pxComponent } = getSpacingAdaptive();
 * // For middle range: calc(6vw - 16px) to calc(6vw - 22px)
 * // Returns middle formula: calc(5.605vw - 14.42px)
 */
export function getSpacingAdaptive(): {
  minRem: number
  maxRem: number
  vwComponent: number
  pxComponent: number
} {
  // spacing-adaptive = clamp(1rem, 6vw - 1rem, 3rem)
  // In the middle range: 6vw - (0.395vw + 14.42px) = 5.605vw - 14.42px
  const vwComponent =
    SPACING_ADAPTIVE.VW_COEFFICIENT -
    SPACING_ADAPTIVE.MIN_REM * REM_SCALING.VW_COEFFICIENT
  const pxComponent = -SPACING_ADAPTIVE.MIN_REM * REM_SCALING.PX_BASE

  return {
    minRem: SPACING_ADAPTIVE.MIN_REM,
    maxRem: SPACING_ADAPTIVE.MAX_REM,
    vwComponent,
    pxComponent,
  }
}

/**
 * Generates a sizes attribute for responsive images using media queries
 *
 * @param widthFormula - Object describing the width calculation
 * @returns A valid HTML sizes attribute string
 *
 * @example
 * const formula = { remValue: 42, subtractSpacingAdaptive: 4, subtractRem: 0.4 };
 * const sizes = generateSizesAttribute(formula);
 * // Returns: "(max-width: 400px) 610px, (max-width: 1920px) calc(16.59vw + 583.23px), 902px"
 */
export function generateSizesAttribute(widthFormula: {
  /** Base width in rem (e.g., 42rem for container) */
  remValue?: number
  /** Number of spacing-adaptive units to subtract (e.g., 4 for borders) */
  subtractSpacingAdaptive?: number
  /** Additional rem to subtract (e.g., 0.4 for thin borders) */
  subtractRem?: number
  /** Additional vw to subtract (e.g., 12 for viewport-relative borders) */
  subtractVw?: number
  /** Additional px to add (e.g., 29 for fixed offsets) */
  addPx?: number
}): string {
  const {
    remValue = 0,
    subtractSpacingAdaptive = 0,
    subtractRem = 0,
    subtractVw = 0,
    addPx = 0,
  } = widthFormula

  // Calculate base width in viewport units
  const baseRem =
    remValue - subtractRem - subtractSpacingAdaptive * SPACING_ADAPTIVE.MAX_REM
  const { vwComponent: baseVw, pxComponent: basePx } = remToViewport(baseRem)

  // Calculate spacing-adaptive contribution
  const spacingAdaptive = getSpacingAdaptive()
  const spacingVw = subtractSpacingAdaptive * spacingAdaptive.vwComponent
  const spacingPx = subtractSpacingAdaptive * spacingAdaptive.pxComponent

  // Combine all components
  const totalVw = baseVw - spacingVw - subtractVw
  const totalPx = basePx - spacingPx + addPx

  // Calculate min/max bounds
  const { minPx, maxPx } = remToPixels(remValue - subtractRem)
  const spacingMinPx =
    subtractSpacingAdaptive * SPACING_ADAPTIVE.MIN_REM * REM_SCALING.MIN_PX
  const spacingMaxPx =
    subtractSpacingAdaptive * SPACING_ADAPTIVE.MAX_REM * REM_SCALING.MAX_PX

  const minWidth = Math.round(minPx - spacingMinPx + addPx)
  const maxWidth = Math.round(maxPx - spacingMaxPx + addPx)

  // Generate sizes attribute
  return [
    `(max-width: ${REM_SCALING.MIN_VIEWPORT_PX}px) ${minWidth}px`,
    `(max-width: ${REM_SCALING.MAX_VIEWPORT_PX}px) calc(${totalVw.toFixed(2)}vw + ${totalPx.toFixed(2)}px)`,
    `${maxWidth}px`,
  ].join(", ")
}

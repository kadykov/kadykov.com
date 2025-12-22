/**
 * Individual Photo OpenGraph Template
 *
 * Displays a photo with a simple frame and metadata.
 * The photo is embedded as a base64 JPEG from the optimized build output.
 */

import { defaultPalette, colors } from "../colors"
import { fontFamilies } from "../fonts"
import { OG_WIDTH, OG_HEIGHT, svgToDataUrl } from "./base"

export interface PhotoOGProps {
  title: string
  description: string
  logoSvg: string
  /** Base64 data URL of the photo */
  photoDataUrl: string
  /** Original photo dimensions for aspect ratio */
  photoWidth: number
  photoHeight: number
  /** Optional date taken */
  dateTaken?: string
  /** Optional tags */
  tags?: string[]
}

/**
 * Calculate photo display dimensions to fit within the available space
 * while maintaining aspect ratio
 */
function calculatePhotoDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  let width = maxWidth
  let height = maxWidth / aspectRatio

  if (height > maxHeight) {
    height = maxHeight
    width = maxHeight * aspectRatio
  }

  return { width: Math.round(width), height: Math.round(height) }
}

export function PhotoOGTemplate({
  title,
  logoSvg,
  photoDataUrl,
  photoWidth,
  photoHeight,
  dateTaken,
}: PhotoOGProps) {
  const logoDataUrl = svgToDataUrl(logoSvg)

  // Layout constants
  const padding = 40
  const logoSize = 80
  const photoAreaWidth = OG_WIDTH - padding * 2
  const photoAreaHeight = OG_HEIGHT - padding * 2 - 80 // Reserve space for title below

  // Calculate photo dimensions to fit the available area
  // Leave some margin around the photo for the frame effect
  const frameMargin = 16
  const maxPhotoWidth = photoAreaWidth - frameMargin * 2
  const maxPhotoHeight = photoAreaHeight - frameMargin * 2

  const photoDims = calculatePhotoDimensions(
    photoWidth,
    photoHeight,
    maxPhotoWidth,
    maxPhotoHeight
  )

  // Truncate title if too long
  const displayTitle =
    title.length > 50 ? title.slice(0, 47).trim() + "..." : title

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: defaultPalette.background,
        fontFamily: fontFamilies.sans,
        padding,
      }}
    >
      {/* Header with logo and title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          gap: 16,
        }}
      >
        <img src={logoDataUrl} width={logoSize} height={logoSize} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              fontFamily: fontFamilies.serif,
              fontSize: 32,
              color: defaultPalette.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {displayTitle}
          </div>
          {dateTaken && (
            <div
              style={{
                fontSize: 18,
                color: defaultPalette.textSecondary,
                marginTop: 4,
              }}
            >
              {dateTaken}
            </div>
          )}
        </div>
      </div>

      {/* Photo with frame */}
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Outer frame (off-white) */}
        <div
          style={{
            display: "flex",
            backgroundColor: colors.surface.offWhite,
            padding: frameMargin,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Inner border (light gray separator) */}
          <div
            style={{
              display: "flex",
              border: `2px solid ${colors.surface.gray}`,
            }}
          >
            <img
              src={photoDataUrl}
              width={photoDims.width}
              height={photoDims.height}
              alt=""
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

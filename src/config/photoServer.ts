/**
 * Centralized configuration for photo server URLs
 *
 * By default, uses the production server (share.kadykov.com).
 * Can be overridden via PHOTO_SERVER_URL environment variable for local development.
 *
 * Usage in .env for local development:
 *   PHOTO_SERVER_URL=http://localhost:8000
 *   PHOTO_SERVER_URL=http://192.168.1.100:8000
 *   PHOTO_SERVER_URL=https://staging.example.com
 *
 * Note: Include the protocol (http:// or https://) in the URL
 */

// Get the photo server base URL from environment variable or use production default
const PHOTO_SERVER_BASE =
  import.meta.env.PHOTO_SERVER_URL || "https://share.kadykov.com"

// Ensure no trailing slash for consistency
export const PHOTO_SERVER_URL = PHOTO_SERVER_BASE.replace(/\/$/, "")

// Manifest URL
export const MANIFEST_URL = `${PHOTO_SERVER_URL}/image_manifest.json`

// Helper function to get full image URL from relative path
export function getImageUrl(relativePath: string): string {
  return `${PHOTO_SERVER_URL}/${relativePath.replace(/^\//, "")}`
}

// Extract domain for Astro image config
export const PHOTO_SERVER_DOMAIN = PHOTO_SERVER_URL.replace(/^https?:\/\//, "")

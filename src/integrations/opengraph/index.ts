/**
 * OpenGraph Image Generation Astro Integration
 *
 * Generates OG images for all pages after the build completes.
 * Uses Satori + Sharp to render React components to PNG.
 *
 * Flow:
 * 1. After build, scan dist/ for HTML files
 * 2. Extract page metadata (title, description, type)
 * 3. Generate appropriate OG image based on page type
 * 4. Write PNG to dist/og/ directory
 *
 * The OG images are then referenced in the HTML via astro-seo component.
 */

import type { AstroIntegration } from "astro"
import fs from "node:fs/promises"
import path from "node:path"
import React from "react"
import { renderToPng, preloadFonts } from "./generator"
import { GeneralOGTemplate } from "./templates/general"
import { BlogOGTemplate } from "./templates/blog"
import { PhotoOGTemplate } from "./templates/photo"
import {
  extractPhotoMetadata,
  parseSrcset,
  selectBestImage,
  loadImageAsDataUrl,
} from "./imageUtils"

// Page metadata extracted from HTML
interface PageMeta {
  title: string
  description: string
  type: "general" | "blog" | "photo" | "gallery"
  // Blog-specific
  tags?: string[]
  pubDate?: Date
  lastUpdatedDate?: Date
  // Photo-specific (future)
  photoUrl?: string
}

// Route info from dist
interface RouteInfo {
  pathname: string // e.g., "/about", "/blog/my-post"
  htmlPath: string // e.g., "dist/about/index.html"
  ogPath: string // e.g., "dist/og/about.png"
}

/**
 * Extract metadata from HTML file
 * Parses meta tags and data attributes to determine page type and content
 */
async function extractPageMeta(htmlPath: string): Promise<PageMeta | null> {
  try {
    const html = await fs.readFile(htmlPath, "utf-8")

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    let title = titleMatch?.[1] || "kadykov.com"
    // Remove site suffix for OG image
    title = title.replace(/ \| kadykov\.com$/, "")

    // Extract description
    const descMatch = html.match(
      /<meta\s+name="description"\s+content="([^"]+)"/
    )
    const description = descMatch?.[1] || ""

    // Check path patterns to determine page type
    const isBlogPost =
      htmlPath.includes("/blog/") && !htmlPath.endsWith("/blog/index.html")
    // Individual photo pages are in /photo/ (singular)
    const isIndividualPhoto =
      htmlPath.includes("/photo/") && !htmlPath.includes("/photos/")
    // Photo gallery pages are in /photos/ (plural)
    const isPhotoGallery = htmlPath.includes("/photos/")

    let type: PageMeta["type"] = "general"
    if (isBlogPost) {
      type = "blog"
    } else if (isIndividualPhoto) {
      type = "photo"
    } else if (isPhotoGallery) {
      type = "gallery"
    }

    // Extract blog-specific metadata
    let tags: string[] = []
    let pubDate: Date | undefined

    if (type === "blog") {
      // Try to extract tags from article:tag meta tags
      const tagMatches = html.matchAll(
        /<meta\s+property="article:tag"\s+content="([^"]+)"/g
      )
      tags = Array.from(tagMatches, (m) => m[1])

      // Try to extract publish date from article:published_time
      const dateMatch = html.match(
        /<meta\s+property="article:published_time"\s+content="([^"]+)"/
      )
      if (dateMatch) {
        pubDate = new Date(dateMatch[1])
      }

      // If no tags from meta, try og-tags data attribute (we'll add this)
      if (tags.length === 0) {
        const ogTagsMatch = html.match(/data-og-tags="([^"]+)"/)
        if (ogTagsMatch) {
          tags = ogTagsMatch[1].split(",").map((t) => t.trim())
        }
      }

      // If no date from meta, try og-date data attribute
      if (!pubDate) {
        const ogDateMatch = html.match(/data-og-date="([^"]+)"/)
        if (ogDateMatch) {
          pubDate = new Date(ogDateMatch[1])
        }
      }
    }

    return {
      title,
      description,
      type,
      tags,
      pubDate,
    }
  } catch (error) {
    console.error(`Failed to extract meta from ${htmlPath}:`, error)
    return null
  }
}

/**
 * Find all HTML files in dist directory
 */
async function findHtmlFiles(distDir: string): Promise<RouteInfo[]> {
  const routes: RouteInfo[] = []

  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Skip og directory and _astro assets
        if (entry.name !== "og" && entry.name !== "_astro") {
          await scanDir(fullPath)
        }
      } else if (entry.name === "index.html") {
        // Calculate pathname from dist path
        const relativePath = path.relative(distDir, dir)
        const pathname = relativePath === "" ? "/" : `/${relativePath}`

        // Calculate OG image path
        const ogFilename =
          pathname === "/"
            ? "index.png"
            : `${relativePath.replace(/\//g, "-")}.png`
        const ogPath = path.join(distDir, "og", ogFilename)

        routes.push({
          pathname,
          htmlPath: fullPath,
          ogPath,
        })
      }
    }
  }

  await scanDir(distDir)
  return routes
}

/**
 * Create the OpenGraph integration
 */
export function opengraphIntegration(): AstroIntegration {
  let distDir: string
  let logoSvg: string

  return {
    name: "opengraph",
    hooks: {
      "astro:config:done": async ({ config }) => {
        // Store output directory
        distDir = config.outDir.pathname

        // Load logo SVG
        const logoPath = path.join(process.cwd(), "public", "icon.svg")
        logoSvg = await fs.readFile(logoPath, "utf-8")
      },

      "astro:build:done": async ({ logger }) => {
        const log = logger.fork("opengraph")
        log.info("Generating OpenGraph images...")

        // Preload fonts for better performance
        await preloadFonts()

        // Find all HTML files
        const routes = await findHtmlFiles(distDir)
        log.info(`Found ${routes.length} pages`)

        // Create og directory
        const ogDir = path.join(distDir, "og")
        await fs.mkdir(ogDir, { recursive: true })

        // Generate OG images for each route
        let generated = 0
        let skipped = 0

        for (const route of routes) {
          try {
            // Read HTML content once
            const html = await fs.readFile(route.htmlPath, "utf-8")

            const meta = await extractPageMeta(route.htmlPath)
            if (!meta) {
              log.warn(`Skipping ${route.pathname}: could not extract metadata`)
              skipped++
              continue
            }

            // Skip pages without meaningful content
            if (!meta.title || meta.title === "kadykov.com") {
              log.warn(`Skipping ${route.pathname}: no title`)
              skipped++
              continue
            }

            // Generate appropriate template
            let element: React.ReactElement

            if (meta.type === "photo") {
              // Handle individual photo pages
              const photoMeta = extractPhotoMetadata(html)
              if (photoMeta) {
                // Find a suitable optimized image
                const srcsetEntries = parseSrcset(photoMeta.srcset)
                const bestImage = selectBestImage(srcsetEntries, 450)

                if (bestImage) {
                  try {
                    // Load the optimized image as base64
                    const photoDataUrl = await loadImageAsDataUrl(
                      distDir,
                      bestImage.path
                    )

                    element = React.createElement(PhotoOGTemplate, {
                      title: photoMeta.title,
                      description: photoMeta.description,
                      logoSvg,
                      photoDataUrl,
                      photoWidth: photoMeta.width,
                      photoHeight: photoMeta.height,
                      dateTaken: photoMeta.dateTaken,
                      tags: photoMeta.tags,
                    })
                  } catch (imgError) {
                    log.warn(
                      `Could not load photo for ${route.pathname}, using general template: ${imgError}`
                    )
                    element = React.createElement(GeneralOGTemplate, {
                      title: meta.title,
                      description: meta.description,
                      logoSvg,
                    })
                  }
                } else {
                  // No suitable image found, use general template
                  element = React.createElement(GeneralOGTemplate, {
                    title: meta.title,
                    description: meta.description,
                    logoSvg,
                  })
                }
              } else {
                // Could not extract photo metadata, use general template
                element = React.createElement(GeneralOGTemplate, {
                  title: meta.title,
                  description: meta.description,
                  logoSvg,
                })
              }
            } else if (meta.type === "blog" && meta.pubDate) {
              element = React.createElement(BlogOGTemplate, {
                title: meta.title,
                description: meta.description,
                logoSvg,
                tags: meta.tags || [],
                pubDate: meta.pubDate,
              })
            } else {
              element = React.createElement(GeneralOGTemplate, {
                title: meta.title,
                description: meta.description,
                logoSvg,
              })
            }

            // Render to PNG
            const png = await renderToPng(element)

            // Write to file
            await fs.writeFile(route.ogPath, png)
            generated++

            log.info(
              `Generated: ${route.pathname} -> ${path.basename(route.ogPath)}`
            )
          } catch (error) {
            log.error(`Failed to generate OG for ${route.pathname}: ${error}`)
            skipped++
          }
        }

        log.info(`Done! Generated ${generated} images, skipped ${skipped}`)
      },
    },
  }
}

export default opengraphIntegration

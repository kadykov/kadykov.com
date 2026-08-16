/**
 * Pre-build cache cleanup and migration script.
 *
 * Handles two problems that arise with the Astro image cache:
 *
 * 1. ONE-TIME MIGRATION: If the cache exists in the old location
 *    (node_modules/.astro/assets/), valid entries are copied to the new
 *    location (.astro/assets/) so a full re-download isn't needed.
 *
 * 2. CORRUPT ENTRY CLEANUP: When a build is interrupted mid-optimization
 *    (e.g., due to a network timeout), the JSON metadata sidecar file can
 *    be written as empty/truncated. On the next build, Astro throws:
 *      "An error was encountered while reading the cache file.
 *       Error: SyntaxError: Unexpected end of JSON input"
 *    This script detects and removes such entries so they get regenerated.
 *
 * Run automatically via the `prebuild` npm script.
 */

import { readdir, readFile, copyFile, mkdir, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"

const cacheDir = join(process.cwd(), ".astro", "assets")
const oldCacheDir = join(process.cwd(), "node_modules", ".astro", "assets")

async function main() {
  await mkdir(cacheDir, { recursive: true })

  // ── Step 1: Migrate valid entries from the old cache location ────────────
  // This is a one-time migration. Files already present in cacheDir are
  // skipped so the operation is idempotent on subsequent builds.
  if (existsSync(oldCacheDir)) {
    const oldFiles = await readdir(oldCacheDir)
    const jsonFiles = oldFiles.filter((f) => f.endsWith(".json"))

    if (jsonFiles.length > 0) {
      let migrated = 0
      let skipped = 0
      let corrupt = 0

      for (const jsonFile of jsonFiles) {
        const imageFile = jsonFile.replace(/\.json$/, "")
        const srcJson = join(oldCacheDir, jsonFile)
        const srcImage = join(oldCacheDir, imageFile)
        const destJson = join(cacheDir, jsonFile)
        const destImage = join(cacheDir, imageFile)

        // Already migrated – skip
        if (existsSync(destJson)) {
          skipped++
          continue
        }

        // Validate the JSON before migrating
        try {
          const content = await readFile(srcJson, "utf-8")
          JSON.parse(content)

          await copyFile(srcJson, destJson)
          if (existsSync(srcImage)) {
            await copyFile(srcImage, destImage)
          }
          migrated++
        } catch {
          // Corrupt entry – delete from old location, don't copy
          await rm(srcJson, { force: true })
          await rm(srcImage, { force: true })
          corrupt++
        }
      }

      const parts = []
      if (migrated > 0) parts.push(`migrated ${migrated} entries`)
      if (skipped > 0) parts.push(`${skipped} already present`)
      if (corrupt > 0)
        parts.push(`removed ${corrupt} corrupt entries from old cache`)
      if (parts.length > 0) {
        console.log(`[cache] ${parts.join(", ")}`)
      }
    }
  }

  // ── Step 2: Remove corrupt entries from the current cache ────────────────
  // These are .json sidecar files that exist but contain invalid/empty JSON,
  // left behind by an interrupted build.
  const currentFiles = await readdir(cacheDir)
  const currentJsonFiles = currentFiles.filter((f) => f.endsWith(".json"))
  let cleaned = 0

  for (const jsonFile of currentJsonFiles) {
    const jsonPath = join(cacheDir, jsonFile)
    const imagePath = join(cacheDir, jsonFile.replace(/\.json$/, ""))

    try {
      const content = await readFile(jsonPath, "utf-8")
      JSON.parse(content)
    } catch {
      await rm(jsonPath, { force: true })
      await rm(imagePath, { force: true })
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(
      `[cache] removed ${cleaned} corrupt entries from .astro/assets/`
    )
  }
}

main().catch((e) => {
  // Log but don't fail the build – a cache issue is recoverable
  console.error("[cache] cleanup error:", e.message)
})

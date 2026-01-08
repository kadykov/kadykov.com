import rss from "@astrojs/rss"
import { fetchPhotoManifest } from "../../../../utils/photoData"
import { createPhotoRSSItem } from "../../../../utils/rssHelpers"
import type { APIContext } from "astro"

export async function getStaticPaths() {
  const photos = await fetchPhotoManifest()

  // Get all unique tags from photos
  const uniqueTags = [...new Set(photos.flatMap((photo) => photo.tags || []))]

  return uniqueTags.map((tag) => ({
    params: { tag },
  }))
}

export async function GET(context: APIContext) {
  const { tag } = context.params as { tag: string }
  const photos = await fetchPhotoManifest()
  const siteUrl = context.site!.toString()

  // Filter photos by tag
  const taggedPhotos = photos.filter((photo) => photo.tags?.includes(tag))

  // Sort by date (newest first)
  const sortedPhotos = [...taggedPhotos].sort((a, b) => {
    const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0
    const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0
    return dateB - dateA
  })

  return rss({
    title: `Aleksandr Kadykov | Photos - ${tag}`,
    description: `Photographs tagged with "${tag}"`,
    site: context.site!,
    items: sortedPhotos.map((photo) => createPhotoRSSItem(photo, siteUrl)),
    customData: `<language>en-us</language>`,
  })
}

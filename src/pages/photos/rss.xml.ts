import rss from "@astrojs/rss"
import { fetchPhotoManifest } from "../../utils/photoData"
import { createPhotoRSSItem } from "../../utils/rssHelpers"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const photos = await fetchPhotoManifest()
  const siteUrl = context.site!.toString()

  // Sort photos by date (newest first)
  const sortedPhotos = [...photos].sort((a, b) => {
    const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0
    const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0
    return dateB - dateA
  })

  return rss({
    title: "Aleksandr Kadykov | Photos",
    description: "Latest photographs",
    site: context.site!,
    items: sortedPhotos.map((photo) => createPhotoRSSItem(photo, siteUrl)),
    customData: `<language>en-us</language>`,
  })
}

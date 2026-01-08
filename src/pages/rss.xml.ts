import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { fetchPhotoManifest } from "../utils/photoData"
import { createBlogRSSItem, createPhotoRSSItem } from "../utils/rssHelpers"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true)
  const photos = await fetchPhotoManifest()
  const siteUrl = context.site!.toString()

  // Prepare blog items with category marker
  const blogItems = posts.map((post) => ({
    ...createBlogRSSItem(post, siteUrl),
    categories: [...(post.data.tags || []), "blog"],
  }))

  // Prepare photo items with category marker
  const photoItems = photos.map((photo) => ({
    ...createPhotoRSSItem(photo, siteUrl),
    categories: [...(photo.tags || []), "photo"],
  }))

  // Combine and sort all items by date (newest first)
  const allItems = [...blogItems, ...photoItems].sort((a, b) => {
    return b.pubDate.valueOf() - a.pubDate.valueOf()
  })

  return rss({
    title: "Aleksandr Kadykov",
    description: "Blog posts and photographs",
    site: context.site!,
    items: allItems,
    customData: `<language>en-us</language>`,
  })
}

import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { fetchPhotoManifest } from "../utils/photoData"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true)
  const photos = await fetchPhotoManifest()

  // Prepare blog items
  const blogItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `/blog/${post.slug}/`,
    categories: [...(post.data.tags || []), "blog"],
    // Use OpenGraph PNG image for RSS enclosure
    // Note: OpenGraph images are 1200×630 and universally compatible with RSS readers
    enclosure: {
      url: `${context.site}blog/${post.slug}/og.png`,
      type: "image/png",
      length: 0,
    },
  }))

  // Prepare photo items
  const photoItems = photos.map((photo) => {
    const photoUrl = `${context.site}photo/${photo.slug}/`

    return {
      title:
        photo.title || `Photo from ${photo.dateTaken || photo.relativePath}`,
      pubDate: photo.dateTaken
        ? new Date(photo.dateTaken)
        : new Date(photo.year ?? 0, (photo.month ?? 1) - 1, photo.day ?? 1),
      description: photo.description || photo.title || "",
      link: photoUrl,
      categories: [...(photo.tags || []), "photo"],
      // Use OpenGraph JPEG image for RSS enclosure
      // Note: These are 1200×630 and may be cropped for portrait photos.
      // TODO: When non-AVIF optimized images are available, consider using
      // medium-resolution WebP/JPEG versions instead of cropped OG images
      enclosure: {
        url: `${context.site}photo/${photo.slug}/og.jpg`,
        type: "image/jpeg",
        length: 0,
      },
    }
  })

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

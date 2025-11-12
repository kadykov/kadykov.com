import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { fetchPhotoManifest } from "../utils/photoData"
import { getImageUrl } from "../config/photoServer"

export async function GET(context) {
  const posts = await getCollection("blog")
  const photos = await fetchPhotoManifest()

  // Prepare blog items
  const blogItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `/blog/${post.slug}/`,
    categories: [...(post.data.tags || []), "blog"],
  }))

  // Prepare photo items
  const photoItems = photos.map((photo) => {
    const photoUrl = `${context.site}photo/${photo.slug}/`
    const imageUrl = getImageUrl(photo.relativePath)

    return {
      title:
        photo.title || `Photo from ${photo.dateTaken || photo.relativePath}`,
      pubDate: photo.dateTaken
        ? new Date(photo.dateTaken)
        : new Date(photo.year, photo.month - 1, photo.day),
      description: photo.description || photo.title || "",
      link: photoUrl,
      categories: [...(photo.tags || []), "photo"],
      enclosure: {
        url: imageUrl,
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
    site: context.site,
    items: allItems,
    customData: `<language>en-us</language>`,
  })
}

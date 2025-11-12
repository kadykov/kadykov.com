import rss from "@astrojs/rss"
import { fetchPhotoManifest } from "../../../../utils/photoData"
import { getImageUrl } from "../../../../config/photoServer"

export async function getStaticPaths() {
  const photos = await fetchPhotoManifest()

  // Get all unique tags from photos
  const uniqueTags = [...new Set(photos.flatMap((photo) => photo.tags || []))]

  return uniqueTags.map((tag) => ({
    params: { tag },
  }))
}

export async function GET(context) {
  const { tag } = context.params
  const photos = await fetchPhotoManifest()

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
    site: context.site,
    items: sortedPhotos.map((photo) => {
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
        categories: photo.tags || [],
        enclosure: {
          url: imageUrl,
          type: "image/jpeg",
          length: 0,
        },
      }
    }),
    customData: `<language>en-us</language>`,
  })
}

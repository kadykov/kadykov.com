import rss from "@astrojs/rss"
import { fetchPhotoManifest } from "../../utils/photoData"
import { getImageUrl } from "../../config/photoServer"

export async function GET(context) {
  const photos = await fetchPhotoManifest()

  // Sort photos by date (newest first)
  const sortedPhotos = [...photos].sort((a, b) => {
    const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0
    const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0
    return dateB - dateA
  })

  return rss({
    title: "Aleksandr Kadykov | Photos",
    description: "Latest photographs",
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
        // Include image as enclosure for RSS readers that support it
        enclosure: {
          url: imageUrl,
          type: "image/jpeg",
          length: 0, // RSS spec requires this, but we don't have file size
        },
      }
    }),
    customData: `<language>en-us</language>`,
  })
}

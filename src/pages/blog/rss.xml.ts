import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { createBlogRSSItem } from "../../utils/rssHelpers"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true)
  const siteUrl = context.site!.toString()

  return rss({
    title: "Aleksandr Kadykov | Blog",
    description: "Blog posts",
    site: context.site!,
    items: posts.map((post) => createBlogRSSItem(post, siteUrl)),
    customData: `<language>en-us</language>`,
  })
}

import rss from "@astrojs/rss"
import { getCollection } from "astro:content"

export async function GET(context) {
  // Added context for site
  const posts = await getCollection("blog") // Changed "posts" to "blog"
  return rss({
    title: "Aleksandr Kadykov | Blog",
    description: "Blog posts",
    site: context.site, // Use context.site
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`, // Changed link to /blog/
    })),
    customData: `<language>en-us</language>`,
  })
}

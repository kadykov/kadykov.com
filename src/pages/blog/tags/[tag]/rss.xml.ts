import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import type { APIContext } from "astro"

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true)
  const uniqueTags = [...new Set(posts.flatMap((post) => post.data.tags || []))]

  return uniqueTags.map((tag) => ({
    params: { tag },
  }))
}

export async function GET(context: APIContext) {
  const { tag } = context.params as { tag: string }
  const posts = await getCollection("blog", ({ data }) => data.draft !== true)

  // Filter posts by tag
  const taggedPosts = posts.filter((post) => post.data.tags?.includes(tag))

  return rss({
    title: `Aleksandr Kadykov | Blog - ${tag}`,
    description: `Blog posts tagged with "${tag}"`,
    site: context.site!,
    items: taggedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags || [],
    })),
    customData: `<language>en-us</language>`,
  })
}

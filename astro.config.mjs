import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    icon(),
    sitemap(),
    mdx(),
    playformCompress({
      Image: false,
      CSS: { csso: { restructure: true, forceMediaMerge: true } },
      HTML: {
        "html-minifier-terser": {
          removeComments: true,
        },
      },
    }),
  ],
  site: "https://www.kadykov.com",
  image: {
    domains: ["kadykov.com", "staticflickr.com"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
})

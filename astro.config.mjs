import { defineConfig } from "astro/config"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"

import markdoc from "@astrojs/markdoc"

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon(),
    sitemap(),
    mdx(),
    playformCompress({
      Image: false,
      HTML: {
        "html-minifier-terser": {
          removeComments: true,
        },
      },
    }),
    markdoc(),
  ],
  site: "https://www.kadykov.com",
  image: {
    domains: ["share.kadykov.com"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
})

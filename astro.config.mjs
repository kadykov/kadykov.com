import { defineConfig } from "astro/config"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"

import markdoc from "@astrojs/markdoc"

import react from "@astrojs/react"

// Import the photo server domain for dynamic configuration
const PHOTO_SERVER_DOMAIN =
  process.env.PHOTO_SERVER_URL?.replace(/^https?:\/\//, "").replace(
    /\/$/,
    ""
  ) || "share.kadykov.com"

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
    react(),
  ],
  site: "https://www.kadykov.com",
  image: {
    domains: [PHOTO_SERVER_DOMAIN],
    remotePatterns: [
      {
        protocol: "https",
      },
      {
        protocol: "http",
      },
    ],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
})

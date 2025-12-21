import { defineConfig } from "astro/config"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"
import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import opengraph from "./src/integrations/opengraph"

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
    markdoc(),
    react(),
    // OpenGraph must run before compress to avoid compressing PNGs
    opengraph(),
    playformCompress({
      Image: false,
      HTML: {
        "html-minifier-terser": {
          removeComments: true,
        },
      },
    }),
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

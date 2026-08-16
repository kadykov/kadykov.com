import { defineConfig } from "astro/config"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"
import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import opengraph from "./src/integrations/opengraph"
import { addCopyButton } from "./src/config/shiki-transformers.mts"
import { Agent, setGlobalDispatcher } from "undici"

// Increase the default undici connect timeout from 10 s to 2 min.
// Cloudflare R2 (and similar CDNs) can occasionally take longer than 10 s
// to establish a TLS connection from inside a dev container, causing
// ConnectTimeoutError and leaving corrupt partial cache entries behind.
setGlobalDispatcher(new Agent({ connect: { timeout: 120_000 } }))

// Import the photo server domain for dynamic configuration
const PHOTO_SERVER_DOMAIN =
  process.env.PHOTO_SERVER_URL?.replace(/^https?:\/\//, "").replace(
    /\/$/,
    ""
  ) || "assets.kadykov.com"

// https://astro.build/config
export default defineConfig({
  // Store the image cache in .astro/assets/ instead of the default
  // node_modules/.astro/assets/ so it survives `npm install` / `rm -rf node_modules`.
  // To wipe the cache: `rm -rf .astro/assets/`
  cacheDir: "./.astro/",
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
      transformers: [addCopyButton()],
    },
  },
})

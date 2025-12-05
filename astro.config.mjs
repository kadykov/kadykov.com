import { defineConfig, fontProviders } from "astro/config"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"

import markdoc from "@astrojs/markdoc"

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
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Source Sans 3",
        cssVariable: "--font-sans",
        weights: ["200 900"],
        styles: ["normal", "italic"],
        subsets: ["latin", "cyrillic", "greek", "vietnamese"],
        fallbacks: ["arial", "sans-serif"],
        display: "block",
      },
      {
        provider: fontProviders.fontsource(),
        name: "Bitter",
        cssVariable: "--font-serif",
        weights: ["100 900"],
        styles: ["normal", "italic"],
        subsets: ["latin", "cyrillic", "vietnamese"],
        fallbacks: ["georgia", "serif"],
        display: "block",
      },
      {
        provider: fontProviders.fontsource(),
        name: "Source Code Pro",
        cssVariable: "--font-mono",
        weights: ["200 900"],
        styles: ["normal"],
        subsets: ["latin", "cyrillic", "greek", "vietnamese"],
        fallbacks: ["Courier New", "monospace"],
        display: "block",
      },
    ],
  },
})

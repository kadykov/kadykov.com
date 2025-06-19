import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import playformCompress from "@playform/compress"

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

  vite: {
    plugins: [tailwindcss()],
  },
})

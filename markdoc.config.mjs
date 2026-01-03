import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config"
import shiki from "@astrojs/markdoc/shiki"
import { addCopyButton } from "./src/config/shiki-transformers.mts"

// Import photo server URL for use in Markdoc content
const PHOTO_SERVER_URL = (
  process.env.PHOTO_SERVER_URL || "https://share.kadykov.com"
).replace(/\/$/, "")

export default defineMarkdocConfig({
  variables: {
    // Available in Markdoc as $photoServer
    // Usage: ![alt]($photoServer/images/blog/post/image.png)
    photoServer: PHOTO_SERVER_URL,
  },
  extends: [
    shiki({
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [addCopyButton()],
    }),
  ],
  nodes: {
    image: {
      ...nodes.image, // Apply Markdoc's defaults for other options
      render: component("./src/components/MarkdocImage.astro"),
    },
  },
})

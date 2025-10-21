import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config"
import shiki from "@astrojs/markdoc/shiki"

export default defineMarkdocConfig({
  extends: [
    shiki({
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    }),
  ],
  nodes: {
    image: {
      ...nodes.image, // Apply Markdoc's defaults for other options
      render: component("./src/components/MarkdocImage.astro"),
    },
  },
})

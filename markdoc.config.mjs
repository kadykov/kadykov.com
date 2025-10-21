import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config"

export default defineMarkdocConfig({
  nodes: {
    image: {
      ...nodes.image, // Apply Markdoc's defaults for other options
      render: component("./src/components/MarkdocImage.astro"),
    },
  },
})

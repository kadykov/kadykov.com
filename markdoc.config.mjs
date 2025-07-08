import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config"

export default defineMarkdocConfig({
  nodes: {
    image: {
      ...nodes.image, // Apply Markdoc's defaults for other options
      render: component("./src/components/MarkdocImage.astro"),
    },
  },
  tags: {
    figure: {
      render: component("./src/components/MarkdocFigure.astro"),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        width: { type: Number },
        height: { type: Number },
        displayWidth: { type: Number },
        sizesAttr: { type: String },
        caption: { type: String },
        title: { type: String },
      },
    },
    optimizedFigure: {
      render: component("./src/components/MarkdocOptimizedFigure.astro"),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        displayWidth: { type: Number },
        sizesAttr: { type: String },
        caption: { type: String },
        title: { type: String },
        optimized: { type: Boolean },
      },
    },
  },
})

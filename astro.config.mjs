import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({}),
    icon(),
    sitemap(),
    mdx(),
  ],
  site: "https://www.kadykov.com",
  image: {
    domains: [
      "kadykov.com",
      "staticflickr.com",
    ],
    remotePatterns: [{
      protocol: "https"
    }]
  }
});

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [tailwind({}), icon(), sitemap()],
  site: "https://www.kadykov.com",
  image: {
    domains: ["kadykov.com"],
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },
});

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		icon()
	],
	site: 'https://kadykov.com',
	image: {
		domains: ["kadykov.com"],
		remotePatterns: [{
			protocol: "https"
		}]
	}
});

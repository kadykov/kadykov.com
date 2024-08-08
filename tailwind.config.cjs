import defaultTheme from 'tailwindcss/defaultTheme'
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Overpass Variable"', ...defaultTheme.fontFamily.sans],
				serif: ['"Lora Variable"', ...defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [],
};

import defaultTheme from 'tailwindcss/defaultTheme'
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Mulish Variable"', ...defaultTheme.fontFamily.sans],
				serif: ['"Martel"', ...defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [],
};

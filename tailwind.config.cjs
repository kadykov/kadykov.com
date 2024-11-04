import defaultTheme from 'tailwindcss/defaultTheme'
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
				serif: ['"IBM Plex Serif"', ...defaultTheme.fontFamily.serif],
			},
    },
    screens: {
      // From https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1500px",
      "2xl": "1800px",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

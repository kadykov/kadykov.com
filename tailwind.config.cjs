import defaultTheme from "tailwindcss/defaultTheme"
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3 Variable"', ...defaultTheme.fontFamily.sans],
        serif: ['"Faustina Variable"', ...defaultTheme.fontFamily.serif],
        mono: ['"Source Code Pro Variable"', ...defaultTheme.fontFamily.mono],
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
  daisyui: {
    themes: ["fantasy", "dracula"],
    darkTheme: "dracula",
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

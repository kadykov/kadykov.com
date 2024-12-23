import defaultTheme from "tailwindcss/defaultTheme"
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Yaldevi Variable"', ...defaultTheme.fontFamily.sans],
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
    themes: [
      {
        light: {
          primary: "#a991f7",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
        dark: {
          primary: "#a991f7",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#252f3f",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}

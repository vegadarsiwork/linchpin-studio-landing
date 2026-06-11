/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7c3cff",
          light: "#8f63ff",
          dark: "#6020e0",
        },
        highlight: "#38bdf8",
        surface: {
          DEFAULT: "#0f0b18",
          2: "#171225",
          3: "#211a33",
          4: "#2c3448",
        },
      },
      fontFamily: {
        display: ['"ClashDisplay-Variable"', '"Clash Display"', "system-ui", "sans-serif"],
        body: ["Satoshi", "system-ui", "sans-serif"],
        sans: ["Satoshi", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

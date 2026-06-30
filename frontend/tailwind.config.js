/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 Yeh line hona sabse zaroori hai!
  ],
  theme: {
    extend: {},
  },
plugins: [
  require("@tailwindcss/typography"),
],
}
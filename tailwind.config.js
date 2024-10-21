/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-page': '#151515',
        'background-sidebar': '#222',
        'background-selected': '#3d3d3d',
      }
    },
  },
  plugins: [],
}
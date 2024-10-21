/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-page': '#1E1E1E',
        'background-sidebar': '#222',
        'background-selected': '#3d3d3d',
        'background-border': '#363636'
      }
    },
  },
  plugins: [],
}
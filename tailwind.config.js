/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Add this line to ensure Tailwind works with all React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
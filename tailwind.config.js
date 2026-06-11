/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  future: {
    // Gate hover:/group-hover: behind @media (hover: hover) so they don't fire
    // via sticky-hover emulation on touch devices, where .tapped (script.js)
    // drives the highlight instead. Default in Tailwind v4.
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0B0B0C',
          charcoal: '#171515',
          white: '#FFFFFF',
          cream: '#F7F0E3',
          nude: '#E8D7B8',
          pink: {
            light: '#F3D58A',
            DEFAULT: '#D4AF37',
            dark: '#A97924',
            berry: '#6F4B17',
          },
          gold: '#D4AF37',
          rosegold: '#B8893F',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
        nav: ['"Oswald"', 'sans-serif'], // Added custom font for Navbar
      },
    },
  },
  plugins: [],
}

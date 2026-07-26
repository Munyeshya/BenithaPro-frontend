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
          black: '#111111',
          charcoal: '#1A1A1A',
          white: '#FFFFFF',
          cream: '#FFF9FB',
          nude: '#FCE7EC',
          pink: {
            light: '#FFB6C1',
            DEFAULT: '#FF69B4',
            dark: '#C71585',
            berry: '#880E4F',
          },
          gold: '#FF69B4',
          rosegold: '#C71585',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
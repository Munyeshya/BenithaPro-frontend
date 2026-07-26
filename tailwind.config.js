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
          black: '#111111',      // Pure jet black
          charcoal: '#1A1A1A',   // Soft charcoal
          white: '#FFFFFF',      // Crisp white
          cream: '#FFF9FB',      // Soft pearl pinkish-ivory tint
          nude: '#FCE7EC',       // Light romantic pink card tint
          pink: {
            light: '#FFD1DC',    // Soft pastel pink
            DEFAULT: '#FF69B4',  // Vibrant chic pink (Too Faced inspired)
            hot: '#FF1493',      // Deep bold magenta pink
            rose: '#E8A4C9',     // Dusty rose pink
          },
          gold: '#FF69B4',       // Replaced gold utility classes with primary pink
          rosegold: '#E8A4C9',   // Replaced rose gold with dusty rose
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
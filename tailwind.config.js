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
            light: '#FFB6C1',    // Light blush pink
            DEFAULT: '#FF69B4',  // Standard chic pink
            dark: '#C71585',     // Deeper dramatic dark pink / magenta
            berry: '#880E4F',    // Deep luxury dark berry pink
          },
          gold: '#FF69B4',       // Primary pink accent
          rosegold: '#C71585',   // Darker pink accent substitute
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
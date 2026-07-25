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
          black: "#111111",      // Deep charcoal black for headers & elegance
          charcoal: "#1A1A1A",   // Soft charcoal backgrounds
          cream: "#FAF7F2",      // Warm pearl ivory / cream background
          gold: "#D4AF37",       // Classic champagne gold
          rosegold: "#E0A96D",   // Rose gold accent
          nude: "#F3E8DF",       // Soft nude card tint
          burgundy: "#581825",   // Rich accent color
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],  // Editorial luxury headings
        sans: ['Inter', 'sans-serif'],          // Clean body typography
      }
    },
  },
  plugins: [],
}
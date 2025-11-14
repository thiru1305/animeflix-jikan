/** @type {import('tailwindcss').Config} */
export default {
  // Add this line so utilities are applied with higher priority
  important: '#root',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          dark: '#141414',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
